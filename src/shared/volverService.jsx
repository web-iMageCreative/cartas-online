import { IconArrowBackUp } from '@tabler/icons-react';

export class VolverService {
  /**
   * Notificación de volver
   */
  static volver(message, options = {}) {
    notifications.show({
      title: options.title || 'Volver',
        message: message,
        color: 'blue',
        icon: <IconArrowBackUp size={20} />,
        autoClose: options.autoClose || 4000,
        ...options,
      });
    }
}
