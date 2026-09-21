import { IconArrowBackUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Group, ActionIcon } from '@mantine/core';

export function ReturnButton( {url} ) {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(url);
    
  };

  return (
   <Group justify="space-between" align="center" mb="lg">
         <ActionIcon 
           variant="subtle" 
           color="custom.0" 
           onClick={handleVolver}
           aria-label="Volver"
           size="lg"
         >
           <IconArrowBackUp size={24} />
         </ActionIcon>
       </Group>
  );
}