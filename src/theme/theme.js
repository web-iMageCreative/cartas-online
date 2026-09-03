// src/theme/theme.js
import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  // ============================================
  // 1. COLORES
  // ============================================
  
  // Paleta de colores: cada color debe tener 10 tonalidades (índices 0-9)
  // Puede añadir nuevos colores o sobrescribir los existentes [citation:2]
  colors: {
    // Colores por defecto de Mantine (blue, red, green, etc.)
    // Solo necesita definir los que quiera modificar
    brand: [
      '#f0f9ff',
      '#e0f2fe',
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e',
    ],
    custom: [
      '#ceeaf0',
      '#35c7e6',
      '#1a7f96',
      '#015668',
      '#002132',
      '#022739',
      '#022739',
      '#022739',
      '#022739',
      '#022739',
    ]
  },
  
  // Color principal que se usará como valor por defecto en componentes
  // que soporten la prop 'color' [citation:6]
  primaryColor: 'blue',
  
  // Índice (0-9) del color principal que se considera primario
  // Puede ser distinto para modo claro y oscuro [citation:2][citation:6]
  primaryShade: { light: 5, dark: 9 },
  // O simplemente: primaryShade: 6,
  
  // Controla si el color del texto debe cambiar automáticamente basado
  // en el color de fondo para garantizar contraste [citation:5]
  autoContrast: true,
  
  // Valor de luminosidad (0-1) usado para determinar si el texto debe ser
  // claro u oscuro cuando autoContrast está activado [citation:5]
  luminanceThreshold: 0.3,
  
  // Colores blanco y negro por defecto [citation:2]
  white: '#ffffff',
  black: '#000000',
  
  // ============================================
  // 2. TIPOGRAFÍA
  // ============================================
  
  // Fuente principal: se usa en la mayoría de componentes [citation:3]
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  
  // Fuente monoespaciada: se usa en Code, Kbd y CodeHighlight [citation:3]
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  
  // Tamaños de fuente para los componentes [citation:3]
  fontSizes: {
    xs: rem(12),   // 0.75rem
    sm: rem(14),   // 0.875rem
    md: rem(16),   // 1rem
    lg: rem(18),   // 1.125rem
    xl: rem(20),   // 1.25rem
    // Puede añadir tamaños personalizados:
    // xxs: rem(10),
    // xxl: rem(24),
  },
  
  // Alturas de línea para el componente Text [citation:3]
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.55',
    lg: '1.6',
    xl: '1.65',
  },
  
  // Estilos de los encabezados (h1-h6) [citation:3]
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '1.4', fontWeight: '700' },
      h2: { fontSize: rem(30), lineHeight: '1.5', fontWeight: '700' },
      h3: { fontSize: rem(24), lineHeight: '1.5', fontWeight: '600' },
      h4: { fontSize: rem(20), lineHeight: '1.5', fontWeight: '600' },
      h5: { fontSize: rem(16), lineHeight: '1.55', fontWeight: '600' },
      h6: { fontSize: rem(14), lineHeight: '1.6', fontWeight: '500' },
    },
    // textWrap: 'wrap', // Opcional: controla el wrap del texto
  },
  
  // Controla el suavizado de fuentes (-webkit-font-smoothing) [citation:4]
  fontSmoothing: true,
  
  // ============================================
  // 3. ESPACIADO, RADIO Y SOMBRAS
  // ============================================
  
  // Espaciados para paddings y margins [citation:2]
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  
  // Border-radius para la mayoría de componentes [citation:2]
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },
  
  // Radio por defecto (puede ser 'xs' | 'sm' | 'md' | 'lg' | 'xl' o un valor en px/rem) [citation:2]
  defaultRadius: 'md',
  
  // Sombras para componentes como Paper, Modal, Menu [citation:2]
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.10)',
    xl: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
  
  // ============================================
  // 4. BREAKPOINTS (responsive)
  // ============================================
  
  // Puntos de ruptura para diseño responsive [citation:2]
  breakpoints: {
    xs: '36em',   // 576px
    sm: '48em',   // 768px
    md: '62em',   // 992px
    lg: '75em',   // 1200px
    xl: '88em',   // 1408px
  },
  
  // ============================================
  // 5. GRADIENTES Y TRANSICIONES
  // ============================================
  
  // Gradiente por defecto para componentes con variant="gradient" [citation:2]
  defaultGradient: {
    from: 'blue',
    to: 'cyan',
    deg: 45,
  },
  
  // Función de temporización para animaciones [citation:2]
  transitionTimingFunction: 'ease',
  
  // ============================================
  // 6. COMPORTAMIENTO Y ACCESIBILIDAD
  // ============================================
  
  // Controla el anillo de enfoque:
  // 'auto' - solo visible con navegación por teclado (recomendado)
  // 'always' - visible siempre
  // 'never' - oculto siempre (no recomendado) [citation:2][citation:5]
  focusRing: 'auto',
  
  // Clase CSS para personalizar el anillo de enfoque (anula focusRing) [citation:5]
  // focusClassName: 'mi-clase-focus',
  
  // Clase CSS para personalizar los estilos activos [citation:5]
  // activeClassName: 'mi-clase-active',
  
  // Desactiva animaciones para usuarios que prefieren reducir el movimiento [citation:2]
  respectReducedMotion: true,
  
  // Cambia el cursor de elementos como checkbox, radio, select [citation:2]
  cursorType: 'default',
  
  // Dirección del texto: 'ltr' o 'rtl' (right-to-left) [citation:2]
  dir: 'ltr',
  
  // ============================================
  // 7. LOADER POR DEFECTO
  // ============================================
  
  // Loader usado en Loader y LoadingOverlay [citation:2]
  loader: 'oval', // 'oval' | 'bars' | 'dots'
  
  // ============================================
  // 8. ESTILOS Y PROPS DE COMPONENTES
  // ============================================
  
  // Personalización de componentes individuales [citation:10]
 components: {
    Box: {
      styles: (theme) => ({
        root: {
          // En modo oscuro, el fondo será ligeramente diferente
          backgroundColor: theme.defaultGradient.dark[7],
        },
      }),
    },
    Paper: {
      styles: (theme) => ({
        root: {
          // En modo oscuro, el fondo será ligeramente diferente
          backgroundColor: theme.colors.custom[8],
          borderColor: theme.colors.custom[3]
        },
      }),
    },
    // Card: {
    //   styles: (theme) => ({
    //     root: {
    //       backgroundColor: theme.colors.dark[6],
    //     },
    //   }),
    // },
    Button: {
      styles: (theme, { variant }) => ({
        root: {
          backgroundColor: variant === 'filled' ? theme.colors.custom[3] : 'transparent',
          borderColor: variant === 'outline' ? theme.colors.custom[3] : 'transparent',
          color: theme.colors.custom[1],
          
        },
      }),
    },
    // TextInput: {
    //   styles: (theme) => ({
    //     root: {
    //       // cuando el wrapper está enfocado (Mantine añade data-focused)
    //       '&[data-focused]': {
    //         // selector más específico hacia el input interno
    //         '& .mantine-TextInput-input': {
    //           border: `1px solid ${theme.colors.custom[2]}`,
    //           boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //         },
    //       },
    //     },
    //     input: {
    //       backgroundColor: theme.colors.custom[4],
    //       border: `1px solid ${theme.colors.custom[3]}`,
    //       borderRadius: theme.radius.md,
    //       outline: 'none',
    //       color: theme.colors.custom[0],
    //       // cubrir también el foco directo sobre el input
    //       '&:focus': {
    //         border: `1px solid ${theme.colors.custom[2]}`,
    //         boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //         outline: 'none',
    //       },
    //       '&:focus-visible': {
    //         border: `1px solid ${theme.colors.custom[2]}`,
    //         boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //       },
    //       '&::placeholder': {
    //         color: theme.colorScheme === 'dark' ? theme.colors.custom[2] : theme.colors.custom[6],
    //         opacity: 1,
    //       },
    //     },
    //     label: {
    //       color: theme.colors.custom[1],
    //     },
    //   }),
    // },

    // PasswordInput: {
    //   styles: (theme) => ({
    //     root: {
    //       border: 'none',
    //       '&[data-focused]': {
    //         '& .mantine-PasswordInput-input': {
    //           border: `1px solid ${theme.colors.custom[1]}`,
    //           boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //         },
    //       },
    //     },
    //     input: {
    //       backgroundColor: theme.colors.custom[4],
    //       border: `1px solid ${theme.colors.custom[3]}`,
    //       borderRadius: theme.radius.md,
    //       outline: 'none',
    //       color: theme.colors.custom[0],
    //       '&:focus': {
    //         border: `1px solid ${theme.colors.custom[1]}`,
    //         boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //         outline: 'none',
    //       },
    //       '&:focus-visible': {
    //         border: `1px solid ${theme.colors.custom[1]}`,
    //         boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33`,
    //       },
    //       '&::placeholder': {
    //         color: theme.colorScheme === 'dark' ? theme.colors.custom[2] : theme.colors.custom[6],
    //         opacity: 1,
    //       },
    //     },
    //     label: {
    //       color: theme.colors.custom[1],
    //     },
    //     rightSection: {
    //       color: theme.colors.custom[1],
    //     },
    //   }),
    // },
  },
  
  // ============================================
  // 9. ESTILOS GLOBALES
  // ============================================
  
  // Estilos globales añadidos a la aplicación [citation:2]
  globalStyles: (theme) => ({
    // foco / wrapper focused y foco directo sobre el input
    '.mantine-TextInput-root[data-focused] .mantine-TextInput-input, .mantine-TextInput-input:focus': {
      border: `1px solid ${theme.colors.custom[2]} !important`,
      boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33 !important`,
      outline: 'none',
    },
    '.mantine-PasswordInput-root[data-focused] .mantine-PasswordInput-input, .mantine-PasswordInput-input:focus': {
      border: `1px solid ${theme.colors.custom[1]} !important`,
      boxShadow: `0 0 0 2px ${theme.colors.custom[2]}33 !important`,
      outline: 'none',
    },
    // placeholder global
    '.mantine-TextInput-input::placeholder, .mantine-PasswordInput-input::placeholder': {
      color: theme.colorScheme === 'dark' ? theme.colors.custom[2] : theme.colors.custom[6],
      opacity: 1,
    },
  }),
  
  // ============================================
  // 10. PROPIEDADES PERSONALIZADAS
  // ============================================
  
  // Añadir sus propias propiedades al tema [citation:2]
  other: {
    gradients: {
      // Gradiente cálido (rojo-naranja)
      basic: {
        from: '#242424',
        to: '#7dd3fc',
        deg: 45,
      },
    },
  },
});