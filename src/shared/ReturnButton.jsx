import { IconArrowBackUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';

export function ReturnButton({ url }) {
  const navigate = useNavigate();

  return (
    <Button variant='subtle' onClick={() => navigate(url)} leftSection={<IconArrowBackUp size={24} />}>Volver</Button>
  );
}