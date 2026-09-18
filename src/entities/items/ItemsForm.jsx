import { useForm } from '@mantine/form';
import ItemsService from './ItemsService';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import {
  Paper,
  TextInput,
  Textarea,
  Button,
  Title,
  Stack,
  Group,
  Container,
  FileInput,
  Box,
  Overlay,
  Checkbox,
  Select
} from '@mantine/core';

const defaultValues = {
  id: undefined,
  name: undefined,
  description: undefined,
  image: undefined,
  price: undefined,
  menu_id: undefined,
  category_id: undefined,
  allergens: []
};

export default function ItemsForm({
  initialValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  menuSlug
}) {
  const [allergens, setAllergens] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchAllergens = async () => {
      await ItemsService.getAllergens()
        .then((data) => { setAllergens(data) })
        .catch((error) => console.log(error))
    }

    const fetchCategories = async () => {
      try {
        const categories = await ItemsService.getCategories(menuSlug);

        // Separar padres e hijas según la columna parent
        const parents = categories.filter(c => c.parent === null || c.parent === undefined);
        const children = categories.filter(c => c.parent !== null && c.parent !== undefined);

        // Agrupar por padre con sub-ítems
        const formattedData = parents.map((parent) => {
          const subCategories = children.filter((child) => String(child.parent) === String(parent.id));

          return {
            group: parent.name, // Nombre de la categoría padre como encabezado de grupo
            items: [
              { value: String(parent.id), label: `${parent.name} (Principal)` },
              ...subCategories.map((sub) => ({
                value: String(sub.id),
                label: `└ ${sub.name}`, // Muestra las subcategorías con sangría visual
              })),
            ],
          };
        });
        console.log("Categorías formateadas para el Select:", formattedData);
        setCategoryOptions(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllergens();
    fetchCategories();

  }, []);


  const form = useForm({
    initialValues: mode === 'create' ? defaultValues : initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
      price: (value) => (value.trim().length === 0 ? 'El precio es obligatorio' : null),
      category_id: (value) => (value.trim().length === 0 ? 'La categoría es obligatoria es obligatorio' : null)
    },
  });

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    const formatted = raw.replace(/\./g, ',');
    form.setFieldValue('price', formatted);
    return formatted;
  }

  const handleSubmit = (values) => {
    values.price = values.price.replace(/,/g, '.')
    onSubmit(values);
  };

  const handleDeleteImage = (image) => {
    if (image === 'image') {
      form.setFieldValue('deleteImage', true);
      form.setFieldValue('image', undefined);
    }
  };

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto - ' + initialValues.name}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Fila 1: Nombre y Slug */}

          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <TextInput
                label="Nombre"
                placeholder="Ej: Hamburguesa"
                withAsterisk
                {...form.getInputProps('name')}
              />

              <Textarea
                label="Descripción"
                placeholder="Breve descripción del artículo..."
                rows={4}
                {...form.getInputProps('description')}
              />
              <TextInput
                label="Precio"
                placeholder="Ej: 10.99"
                withAsterisk
                {...form.getInputProps('price')}
                onChange={handlePriceChange}
              />
            </Stack>
          </Paper>
          <Stack gap="md">
            <Paper shadow="md" p="lg">
              <Group grow align="flex-start">
                <Select
                  label="Categoría"
                  placeholder="Selecciona una categoría"
                  data={categoryOptions}
                  searchable
                  clearable
                  withAsterisk
                  disabled={categoryOptions.length === 0}
                  value={form.values.category_id ? String(form.values.category_id) : null}
                  onChange={(value) => {
                    form.setFieldValue('category_id', value);
                  }}
                />
              </Group>
            </Paper>
          </Stack>


          {/* Fila 3: Imágenes (Archivos) */}
          <Paper p="lg" shadow="md">
            <Group grow align="flex-start">

              {form.values.image ? (
                <Box className='form-image-box'>
                  <label className='mantine-FileInput-label'>imagen</label>
                  <Box radius="md">
                    <Box bg={"url(" + (form.values.image instanceof File ? URL.createObjectURL(form.values.image) : form.values.image) + ")"}>
                      <Button onClick={() => handleDeleteImage('image')} href="#" c="white"><IconTrash /></Button>
                      <Overlay></Overlay>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <FileInput
                  label="imagen"
                  placeholder="Seleccionar imagen"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  leftSection={<IconUpload size={18} stroke={1.5} />}
                  clearable
                  {...form.getInputProps('image')}
                />
              )}
            </Group>
          </Paper>

          <Paper p="lg">
            <Checkbox.Group
              label="Alérgenos"
              description="Marca los Alérgenos de este Item"
              {...form.getInputProps('allergens')}
            >

              <Box mt="md" style={{ columnCount: '2' }}>

                {allergens && allergens.map((allergen) => (
                  <Checkbox mb="md"
                    key={String(allergen.id)}
                    value={String(allergen.id)}
                    label={
                      <>
                        <Group gap="sm" align='center'><img src={allergen.icon} width="24" height="24" /> <span>{allergen.name}</span></Group>
                      </>
                    } />
                ))}

              </Box>

            </Checkbox.Group>
          </Paper>

          {/* Acciones del formulario */}
          <Paper className="form-actions" shadow="md" p="lg">
            <Button
              variant="filled"
              type="submit"
              loading={isLoading}
              c="brand.3"
            >
              {submitLabel || (mode === 'create' ? 'Crear Artículo' : 'Guardar Cambios')}
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
