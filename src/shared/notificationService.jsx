// src/services/notificationService.js
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconInfoCircle, IconAlertTriangle } from '@tabler/icons-react';

/**
 * Servicio centralizado para mostrar notificaciones
 */
export const notificationService = {
  /**
   * Notificación de éxito
   */
  success(message, options = {}) {
    notifications.show({
      title: options.title || 'Éxito',
      message: message,
      color: 'green',
      icon: <IconCheck size={20} />,
      autoClose: options.autoClose || 4000,
      ...options,
    });
  },

  /**
   * Notificación de error
   */
  error(message, options = {}) {
    notifications.show({
      title: options.title || 'Error',
      message: message,
      color: 'red',
      icon: <IconX size={20} />,
      autoClose: options.autoClose || 6000,
      ...options,
    });
  },

  /**
   * Notificación de información
   */
  info(message, options = {}) {
    notifications.show({
      title: options.title || 'Información',
      message: message,
      color: 'blue',
      icon: <IconInfoCircle size={20} />,
      autoClose: options.autoClose || 4000,
      ...options,
    });
  },

  /**
   * Notificación de advertencia
   */
  warning(message, options = {}) {
    notifications.show({
      title: options.title || 'Advertencia',
      message: message,
      color: 'yellow',
      icon: <IconAlertTriangle size={20} />,
      autoClose: options.autoClose || 5000,
      ...options,
    });
  },

  /**
   * Notificación personalizada
   */
  custom(options) {
    notifications.show(options);
  },

  /**
   * Limpiar todas las notificaciones
   */
  clear() {
    notifications.clean();
  },

  /**
   * Actualizar una notificación existente
   */
  update(id, options) {
    notifications.update({
      id,
      ...options,
    });
  },

  /**
   * Mostrar notificación de carga (para operaciones largas)
   */
  loading(message, options = {}) {
    const id = notifications.show({
      title: options.title || 'Cargando...',
      message: message,
      color: 'blue',
      loading: true,
      autoClose: false,
      ...options,
    });
    return id;
  },

  /**
   * Actualizar una notificación de carga a éxito
   */
  loadingSuccess(loadingId, message, options = {}) {
    notifications.update({
      id: loadingId,
      title: options.title || 'Completado',
      message: message,
      color: 'green',
      icon: <IconCheck size={20} />,
      loading: false,
      autoClose: options.autoClose || 4000,
      ...options,
    });
  },

  /**
   * Actualizar una notificación de carga a error
   */
  loadingError(loadingId, message, options = {}) {
    notifications.update({
      id: loadingId,
      title: options.title || 'Error',
      message: message,
      color: 'red',
      icon: <IconX size={20} />,
      loading: false,
      autoClose: options.autoClose || 6000,
      ...options,
    });
  },
};

// Exportar también el objeto notifications para uso directo si es necesario
export { notifications };