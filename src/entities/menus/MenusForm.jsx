import { Title, Stack, TextInput, Button, Paper, Container, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function MenusForm({
  initialValues = null,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
  submitLabel = 'Crear Menú',
}) {
  const form = useForm({
    initialValues: mode === 'edit' ? initialValues : { name: '', slug: '', description: ''},
    validate: {
      name: (value) => (value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null),
      description: (value) => (value.length < 2 ? 'la descripción es obligatoria' : null),
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
    if (!values.slug && values.name) {
      values.slug = generateSlug(values.name);
    }

    onSubmit(values);
  };

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        Nuevo Menú
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper shadow='md' p="md">
            <Stack gap="md">
              <Group grow align="flex-start">
                <TextInput
                  label="Nombre del menú"
                  placeholder="Da un nombre al menú"
                  withAsterisk
                  {...form.getInputProps('name')}
                />
              </Group>
              <Group grow align="flex-start">
                <TextInput
                  label="Descripción"
                  placeholder="Describe en qué consiste el Menú"
                  withAsterisk
                  {...form.getInputProps('description')}
                />
              </Group>
            </Stack>
          </Paper>

          <Paper shadow='md' className='form-actions' p="md">
            <Button
              variant='filled' 
              type="submit"
              loading={isLoading}
            >
              {submitLabel}
            </Button>

            <Button variant="outline" onClick={() => onCancel()}>
              Cancelar
            </Button>
          </Paper>

        </Stack>
      </form>
    </Container>
  );
}