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

const defaultCategoryValues = {
  id: '',
  name: '',
  description: '',
  menu_id: '',
  parent: null,
  is_active: '',
};

export default function CategoriesForm({
  initialValues = defaultCategoryValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  parentCategories = [],
}) {
    
  const formattedInitialValues = {
    ...defaultCategoryValues,
    ...initialValues,
    menu_id: initialValues?.menu_id ? String(initialValues.menu_id) : null,
    parent: initialValues?.parent ? String(initialValues.parent) : null,
  };

  const form = useForm({
    initialValues: mode === 'create' ? defaultCategoryValues : formattedInitialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null)
    },
  });

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
                {console.log("Parent Categories in CategoriesForm:", parentCategories)}
                <Select
                  label="Categoría Padre"
                  placeholder="Ninguna (Categoría Principal)"
                  data={parentCategories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
                  searchable
                  clearable
                  value={form.values.parent ? String(form.values.parent) : null}
                  {...form.getInputProps('parent')}
                />
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