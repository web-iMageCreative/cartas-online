import { useForm, useEffect } from '@mantine/form';
import ItemsService from './ItemsService';
import { IconUpload, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
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
  Checkbox
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
}) {
  const [allergens, setAllergens] = useState(null);

  useEffect(() => {
    const fetchAllergens = async () => {
      await ItemsService.getAllergens()
        .then((data) => {setAllergens(data)})
        .catch((error) => console.log(error))
    }

    fetchAllergens();
  }, []);

  const form = useForm({
    initialValues: mode === 'create' ? defaultValues : initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
      price: (value) => (value.trim().length === 0 ? 'El precio es obligatorio' : null),
    },
  });

  

  const handleSubmit = (values) => {
    onSubmit(values);
  };

 const handleDeleteImage = (image) => {
  if (image === 'image') {
    form.setFieldValue('deleteImage', true);
    form.setFieldValue('image', null);
  }
};

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Artículo' : 'Editar Artículo'}
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
              />
            </Stack>
          </Paper>

         
          {/* Fila 3: Imágenes (Archivos) */}
          <Paper p="lg" shadow="md">
            <Group grow align="flex-start">

              {form.values.image ? (
                <Box className='form-image-box'>
                  <label className='mantine-FileInput-label'>imagen</label>
                  <Box radius="md">
                    <Box bg={"url(" + (form.values.image instanceof File? URL.createObjectURL(form.values.image) : form.values.image) +")"}>
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

              <Box mt="md" style={{columnCount: '2'}}>

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
