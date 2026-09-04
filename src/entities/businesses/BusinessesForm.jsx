import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  Switch,
  Button,
  Paper,
  Title,
  Stack,
  Group,
} from '@mantine/core';

export const defaultBusinessValues = {
  name: '',
  slug: '',
  description: '',
  cover_image: '',
  logo: '',
  address: '',
  email: '',
  phone: '',
  is_active: true,
};

export default function BusinessesForm({
  initialValues = defaultBusinessValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Crear Negocio',
}) {
  // Inicializamos el formulario usando Mantine Form
  const form = useForm({
    initialValues: mode === 'create' ? defaultBusinessValues : initialValues,
    validate: {
      name: (value) => (value.trim().length === 0 ? 'El nombre es obligatorio' : null),
      email: (value) => (value && !/^\S+@\S+$/.test(value) ? 'Email inválido' : null),
      slug: (value) => (value.trim().length === 0 ? 'El slug es obligatorio' : null),
    },
  });

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
};

  return (
    <Paper withBorder shadow="md" p={30} radius="md">
      <Title order={2} ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Negocio' : 'Editar Negocio'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Fila 1: Nombre y Slug */}
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

          {/* Fila 3: Imágenes (URLs) */}
          <Group grow align="flex-start">
            <TextInput
              label="URL del Logo"
              placeholder="https://ejemplo.com/logo.png"
              {...form.getInputProps('logo')}
            />
            <TextInput
              label="URL de la Portada"
              placeholder="https://ejemplo.com/portada.jpg"
              {...form.getInputProps('cover_image')}
            />
          </Group>

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
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}