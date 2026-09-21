import { useForm } from '@mantine/form';
import ItemsService from './ItemsService';
import { IconUpload, IconTrash, IconPlus } from '@tabler/icons-react';
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
  Select,
  Fieldset
} from '@mantine/core';

const defaultValues = {
  id: undefined,
  name: '',
  description: '',
  image: undefined,
  price: '',
  menu_id: undefined,
  category_id: undefined,
  allergens: [],
  variations: []
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

  const formattedInitialValues = {
    ...defaultValues,
    ...initialValues,
    price: initialValues?.price ? String(initialValues.price).replace(/\./g, ',') : '',
    variations: (initialValues?.variations && initialValues.variations.length > 0)
      ? initialValues.variations.map((v) => ({
          ...v,
          price: v.price ? String(v.price).replace(/\./g, ',') : ''
        }))
      : []
  };

  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const data = await ItemsService.getAllergens();
        setAllergens(data);
      } catch (error) {
        console.error('Error cargando alérgenos:', error);
      }
    };
    fetchAllergens();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await ItemsService.getCategories(menuSlug);
        const parents = categories.filter(c => c.parent === null || c.parent === undefined);
        const children = categories.filter(c => c.parent !== null && c.parent !== undefined);

        const formattedData = parents.map((parent) => {
          const subCategories = children.filter((child) => String(child.parent) === String(parent.id));

          return {
            group: parent.name,
            items: [
              { value: String(parent.id), label: `${parent.name} (Principal)` },
              ...subCategories.map((sub) => ({
                value: String(sub.id),
                label: `└ ${sub.name}`,
              })),
            ],
          };
        });
        setCategoryOptions(formattedData);
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    if (menuSlug) fetchCategories();
  }, [menuSlug]);

  const form = useForm({
    initialValues: mode === 'create' ? defaultValues : formattedInitialValues,
    validate: {
      name: (value) => (!value || value.trim().length === 0 ? 'El nombre es obligatorio' : null),
      category_id: (value) => (!value ? 'La categoría es obligatoria' : null)
    },
  });

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    const formatted = raw.replace(/\./g, ',');
    form.setFieldValue('price', formatted);
  };

  // 🛠️ CORRECCIÓN AQUÍ: Convierte comas a puntos en precio base y en todas las variaciones
  const handleSubmit = (values) => {
    const cleanedValues = {
      ...values,
      price: values.price ? String(values.price).replace(/,/g, '.') : null,
      variations: (values.variations || []).map((v) => ({
        ...v,
        price: v.price ? String(v.price).replace(/,/g, '.') : '0'
      }))
    };
    onSubmit(cleanedValues);
  };

  const handleDeleteImage = () => {
    form.setFieldValue('deleteImage', true);
    form.setFieldValue('image', undefined);
  };

  const addVariation = () => {
    const newVariation = { id: Date.now(), name: '', price: '' };
    form.setFieldValue('variations', [...(form.values.variations || []), newVariation]);
  };

  const removeVariation = (index) => {
    const newArr = (form.values.variations || []).filter((_, i) => i !== index);
    form.setFieldValue('variations', newArr);
  };

  return (
    <Container miw="450">
      <Title order={3} c="custom.0" ta="center" mb="lg">
        {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto - ' + (initialValues?.name || '')}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Paper shadow="md" p="lg">
            <Stack gap="md">
              <TextInput
                label="Nombre"
                placeholder="Ej: Paella"
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
                label="Precio Base"
                placeholder="Ej: 10,99"
                description="Déjalo vacío o en 0 si usas variaciones"
                {...form.getInputProps('price')}
                onChange={handlePriceChange}
              />

              <Fieldset legend="Variaciones de precios" bg="custom.4" style={{ borderColor: 'custom.3' }}>
                <Button
                  variant="subtle"
                  my="sm"
                  leftSection={<IconPlus size={16} />}
                  onClick={addVariation}
                >
                  Añadir Variación
                </Button>

                {form.values.variations && form.values.variations.length > 0 && (
                  <Stack gap="xs">
                    {form.values.variations.map((variation, idx) => (
                      <Group key={variation.id || idx} grow align="flex-end">
                        <TextInput
                          label="Nombre de variación"
                          placeholder="Ej: Tapa / Media / Ración"
                          {...form.getInputProps(`variations.${idx}.name`)}
                        />
                        <Group wrap="nowrap" align="end">
                          <TextInput
                            label="Precio (€)"
                            placeholder="Ej: 10,99"
                            {...form.getInputProps(`variations.${idx}.price`)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const formatted = raw.replace(/\./g, ',');
                              form.setFieldValue(`variations.${idx}.price`, formatted);
                            }}
                          />
                          <Button variant="subtle" color="red" onClick={() => removeVariation(idx)}>
                            <IconTrash size={18} />
                          </Button>
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                )}
              </Fieldset>
            </Stack>
          </Paper>

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
                onChange={(value) => form.setFieldValue('category_id', value)}
              />
            </Group>
          </Paper>

          {/* Subida de Imagen */}
          <Paper p="lg" shadow="md">
            <Group grow align="flex-start">
              {form.values.image ? (
                <Box className="form-image-box">
                  <label className="mantine-FileInput-label">Imagen</label>
                  <Box radius="md">
                    <Box bg={"url(" + (form.values.image instanceof File ? URL.createObjectURL(form.values.image) : form.values.image) + ")"}>
                      <Button onClick={handleDeleteImage} c="white"><IconTrash /></Button>
                      <Overlay />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <FileInput
                  label="Imagen"
                  placeholder="Seleccionar imagen"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  leftSection={<IconUpload size={18} stroke={1.5} />}
                  clearable
                  {...form.getInputProps('image')}
                />
              )}
            </Group>
          </Paper>

          {/* Alérgenos */}
          <Paper p="lg">
            <Checkbox.Group
              label="Alérgenos"
              description="Marca los alérgenos de este ítem"
              {...form.getInputProps('allergens')}
            >
              <Box mt="md" style={{ columnCount: '2' }}>
                {allergens && allergens.map((allergen) => (
                  <Checkbox
                    mb="md"
                    key={String(allergen.id)}
                    value={String(allergen.id)}
                    label={
                      <Group gap="sm" align="center">
                        <img src={allergen.icon} width="24" height="24" alt={allergen.name} />
                        <span>{allergen.name}</span>
                      </Group>
                    }
                  />
                ))}
              </Box>
            </Checkbox.Group>
          </Paper>

          {/* Acciones */}
          <Paper className="form-actions" shadow="md" p="lg">
            <Group justify="flex-end">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" loading={isLoading}>
                {submitLabel || (mode === 'create' ? 'Crear Artículo' : 'Guardar Cambios')}
              </Button>
            </Group>
          </Paper>
        </Stack>
      </form>
    </Container>
  );
}