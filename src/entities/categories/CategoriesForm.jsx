import { useForm } from '@mantine/form';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Title,
  Stack,
  Group,
  Container,
  Select,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import CategoriesService from './CategoriesService';

const defaultCategoryValues = {
  id: '',
  name: '',
  description: '',
  menu_id: null,
  parent: null,
};

export default function CategoriesForm({
  initialValues = defaultCategoryValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  menuId
}) {
  const formattedInitialValues = {
    ...defaultCategoryValues,
    ...initialValues,
    menu_id: initialValues?.menu_id ? String(initialValues.menu_id) : menuId,
    parent: initialValues?.parent ? String(initialValues.parent) : null,
  };

  const [ parentCategories, setParentCategories] = useState([]);

  const form = useForm({
    initialValues: mode === 'create' ? defaultCategoryValues : formattedInitialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null)
    },
  });

  useEffect(() => {
    const fetchParents = async () => {
      await CategoriesService.getCategoriesByMenuId(formattedInitialValues.menu_id)
        .then((data) => {
          const categoriesList = Array.isArray(data) ? data : [data];

          if (mode === 'update') {
            const parents = categoriesList.filter(
              (cat) => String(cat.id) !== String(initialValues.id)
            );
            setParentCategories(parents);
          } else {
            setParentCategories(categoriesList);
          }

        })
        .catch((error) => {
          console.log("Error cargando categorias Padre: ", error );
        })
    }

    if (initialValues) {
      fetchParents();
    }
  }, [initialValues]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Fila 1: Nombre y Descripción */}
          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <TextInput
                label="Nombre"
                placeholder="Ej: Bebidas, Entrantes..."
                withAsterisk
                {...form.getInputProps('name')}
              />

              <Textarea
                label="Descripción"
                placeholder="Breve descripción de la categoría..."
                minRows={3}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Paper>

          {/* Fila 2: Relaciones (Menú y Categoría Padre) */}
          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <Group grow align="flex-start">
                {parentCategories && (
                  <Select
                    label="Categoría Padre"
                    placeholder="Ninguna (Categoría Principal)"
                    data={ parentCategories ? parentCategories.map((cat) => ({ value: String(cat.id), label: cat.name })) : ""}
                    searchable
                    clearable
                    disabled={parentCategories.length === 0}
                    value={form.values.parent ? String(form.values.parent) : null}
                    {...form.getInputProps('parent')}
                  />
                )}
              </Group>
            </Stack>
          </Paper>

          {/* Acciones del formulario (Idéntico a BusinessesForm) */}
          <Paper className="form-actions" shadow="md" p="lg">
            <Button
              variant="filled"
              type="submit"
              loading={isLoading}
              c="brand.3"
            >
              {submitLabel || (mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios')}
            </Button>

            <Button
              variant="outline"
              onClick={() => onCancel()}
            >
              Cancelar
            </Button>
          </Paper>
        </Stack>
      </form>
    </Container>
  );
}