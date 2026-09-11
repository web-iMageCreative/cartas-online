import { useForm } from '@mantine/form';
import { IconUpload, IconPhoto, IconTrash } from '@tabler/icons-react';
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
  Overlay
} from '@mantine/core';

const defaultValues = {
  id: undefined,
  name: undefined,
  slug: undefined,
  description: undefined,
  cover_image: undefined, 
  logo: undefined,       
  address: undefined,
  email: undefined,
  phone: undefined,
  is_active: undefined,
  user_id: undefined
};

export default function BusinessesForm({
  initialValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
}) { 
  const form = useForm({
    initialValues: mode === 'create' ? defaultValues : initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
    },
  });

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = (values) => {
    const updatedValues = { ...values };

    if (!updatedValues.slug && updatedValues.name) {
      updatedValues.slug = generateSlug(updatedValues.name);
    }
    
    onSubmit(updatedValues);
  };

  const handleDeleteImage = (image) => {
    if (image === 'logo') {
      form.setFieldValue('deleteLogo', true);
      form.setFieldValue('logo', null);
    } else {
      form.setFieldValue('deleteCover', true);
      form.setFieldValue('cover_image', null);
    }
  }

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Negocio' : 'Editar Negocio'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Fila 1: Nombre y Slug */}

          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <TextInput
                label="Nombre"
                placeholder="Ej: Mi Restaurante"
                withAsterisk
                {...form.getInputProps('name')}
              />

              <Textarea
                label="Descripción"
                placeholder="Breve descripción del negocio..."
                rows={4}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Paper>

          {/* Fila 2: Email y Teléfono */}
          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <Group grow align="flex-start">
                <TextInput
                  label="Email"
                  placeholder="contacto@negocio.com"        
                  {...form.getInputProps('email')}
                />
                <TextInput
                  label="Teléfono"
                  placeholder="+34 600 000 000"        
                  {...form.getInputProps('phone')}
                />
              </Group>
              <TextInput
                label="Dirección"
                placeholder="Calle Principal, 123"      
                {...form.getInputProps('address')}
              />
            </Stack>
          </Paper>

         

          {/* Fila 3: Imágenes (Archivos) */}
          <Paper p="lg" shadow="md">
            <Group grow align="flex-start">

              {form.values.logo ? (
                <Box className='form-image-box'>
                  <label className='mantine-FileInput-label'>Logo</label>
                  <Box radius="md">
                    <Box bg={"url(" + (form.values.logo instanceof File? URL.createObjectURL(form.values.logo) : form.values.logo) +")"}>
                      <Button onClick={() => handleDeleteImage('logo')} href="#" c="white"><IconTrash /></Button>
                      <Overlay></Overlay>
                    </Box>
                  </Box>
                </Box>
               ) : (
                <FileInput
                  label="Logo"
                  placeholder="Seleccionar logo"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  leftSection={<IconUpload size={18} stroke={1.5} />}
                  clearable
                  {...form.getInputProps('logo')}
                />
               )}              

              {form.values.cover_image ? (
                <Box className='form-image-box'>
                  <label className='mantine-FileInput-label'>Portada</label>
                  <Box radius="md">
                    <Box bg={"url(" + (form.values.cover_image instanceof File? URL.createObjectURL(form.values.cover_image) : form.values.cover_image) +")"}>
                      <Button onClick={() => handleDeleteImage('cover_image')} href="#" c="white"><IconTrash /></Button>
                      <Overlay></Overlay>
                    </Box>
                  </Box>
                </Box>
               ) : (
                <FileInput
                  label="Portada"
                  placeholder="Seleccionar portada"
                  accept="image/png,image/jpeg,image/webp"
                  leftSection={<IconPhoto size={18} stroke={1.5} />}
                  clearable
                  {...form.getInputProps('cover_image')}
                />
               )}
            </Group>
          </Paper>

          {/* Acciones del formulario */}
          <Paper className="form-actions" shadow="md" p="lg">
            <Button
              variant="filled"
              type="submit"
              loading={isLoading}
              c="brand.3"
            >
              {submitLabel || (mode === 'create' ? 'Crear Negocio' : 'Guardar Cambios')}
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