import { useForm } from '@mantine/form';
import { IconUpload, IconPhoto } from '@tabler/icons-react';
import {
  TextInput,
  Textarea,
  Button,
  Title,
  Stack,
  Group,
  FileInput,
} from '@mantine/core';

const defaultBusinessValues = {
  name: '',
  slug: '',
  description: '',
  cover_image: '', 
  logo: '',       
  address: '',
  email: '',
  phone: '',
  is_active: '',
};

export default function BusinessesForm({
  initialValues = defaultBusinessValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
}) {
  // Asegurar que si initialValues trae "" en imágenes, se conviertan a null
  const formattedInitialValues = {
    ...defaultBusinessValues,
    ...initialValues,
    logo: initialValues?.logo || null,
    cover_image: initialValues?.cover_image || null,
  };

  const form = useForm({
    initialValues: mode === 'create' ? defaultBusinessValues : formattedInitialValues,
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
    // Generar el slug automáticamente si no se ha definido
    const updatedValues = { ...values };
    if (!updatedValues.slug && updatedValues.name) {
      updatedValues.slug = generateSlug(updatedValues.name);
    }
      
    onSubmit(updatedValues);
  };

  return (
    <>
      <Title order={3} ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Negocio' : 'Editar Negocio'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit ) } enctype="multipart/form-data">
        <Stack gap="md">
          {/* Fila 1: Nombre */}
          <Group grow align="flex-start">
            <TextInput
              label="Nombre"
              placeholder="Ej: Mi Restaurante"
              withAsterisk
              {...form.getInputProps('name')}
            />
          </Group>

          {/* Descripción */}
          <Textarea
            label="Descripción"
            placeholder="Breve descripción del negocio..."
            minRows={3}
            {...form.getInputProps('description')}
          />

          {/* Fila 2: Email y Teléfono */}
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

          {/* Dirección */}
          <TextInput
            label="Dirección"
            placeholder="Calle Principal, 123"
            {...form.getInputProps('address')}
          />

          {/* Fila 3: Imágenes (Archivos) */}
          <Group grow align="flex-start">
            <FileInput
              label="Logo"
              placeholder="Seleccionar logo"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              leftSection={<IconUpload size={18} stroke={1.5} />}
              clearable
              {...form.getInputProps('logo')}
              value={form.values.logo || null}
            />
            <FileInput
              label="Portada"
              placeholder="Seleccionar portada"
              accept="image/png,image/jpeg,image/webp"
              leftSection={<IconPhoto size={18} stroke={1.5} />}
              clearable
              {...form.getInputProps('cover_image')}
              value={form.values.cover_image || null}
            />
          </Group>

          {/* Acciones del formulario */}
          <Group justify="flex-end" mt="md">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            )}

            <Button
              variant="filled"
              type="submit"
              loading={isLoading}
            >
              {submitLabel || (mode === 'create' ? 'Crear Negocio' : 'Guardar Cambios')}
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}