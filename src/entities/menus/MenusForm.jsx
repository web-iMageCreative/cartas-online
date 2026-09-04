import { Title, Stack, TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function MenusForm({
  initialValues = null,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
}) {
  const form = useForm({
    initialValues: mode === 'edit' ? initialValues : { name: '', slug: '', description: ''},
    validate: {
      name: (value) => (value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null),
      slug: (value) => {
        if (!value) return null;
        return /^[a-z0-9-]+$/.test(value) ? null : 'URL amigable inválida (solo minúsculas, números y guiones)';
      }
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
    // Asegurar que el slug esté generado
    if (!values.slug && values.name) {
      values.slug = generateSlug(values.name);
    }
    onSubmit(values);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
    <Title order={4} c="dimmed" ta="center" mb="lg">
      Formulario Menú
    </Title>
    
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nombre del menú"
          {...form.getInputProps('name')}
        />

        <Button
          variant='filled' 
          type="submit"
          loading={loading}
        >
          Enviar
        </Button>

        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      
      </Stack>
    </form>
    </>
  );
}