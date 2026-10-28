/** @type {import('tailwindcss').Config} */

// As cores apontam para os tokens de src/styles/design-tokens.css, a fonte
// única da identidade. Nenhuma cor é definida aqui diretamente.
const token = (name) => `var(--${name})`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: token('brand-primary'),
          hover: token('brand-primary-hover'),
          pressed: token('brand-primary-pressed'),
          soft: token('brand-primary-soft'),
          fg: token('brand-primary-text'),
        },
        secondary: {
          DEFAULT: token('brand-secondary'),
          hover: token('brand-secondary-hover'),
        },
        accent: token('brand-accent'),
        canvas: token('brand-background'),
        surface: {
          DEFAULT: token('brand-surface'),
          alt: token('brand-surface-alt'),
          hover: token('brand-surface-hover'),
        },
        ink: token('brand-text'),
        // Texto secundário acessível (exceção registrada no design-tokens.css).
        muted: token('text-secondary'),
        // Token original de texto atenuado: ícones, texto grande e desabilitados.
        subtle: token('brand-text-muted'),
        placeholder: token('brand-placeholder'),
        icon: {
          DEFAULT: token('brand-icon'),
          hover: token('brand-icon-hover'),
        },
        line: {
          DEFAULT: token('brand-border'),
          hover: token('brand-border-hover'),
          focus: token('brand-border-focus'),
          control: token('control-border'),
        },
        focus: token('brand-focus-ring'),
        selection: token('brand-selection'),
        overlay: token('brand-overlay'),
        disabled: {
          DEFAULT: token('brand-disabled'),
          fg: token('brand-disabled-text'),
        },
        success: { DEFAULT: token('brand-success'), soft: token('brand-success-soft') },
        warning: { DEFAULT: token('brand-warning'), soft: token('brand-warning-soft') },
        danger: { DEFAULT: token('brand-danger'), soft: token('brand-danger-soft') },
        info: { DEFAULT: token('brand-info'), soft: token('brand-info-soft') },
      },
      fontFamily: {
        sans: token('font-sans'),
        display: token('font-display'),
      },
      fontSize: {
        xs: ['13px', '18px'],
        sm: ['14px', '20px'],
        base: ['15px', '23px'],
        md: ['16px', '24px'],
        lg: ['18px', '26px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['32px', '40px'],
      },
      borderRadius: {
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        brand: token('brand-radius'),
        field: token('field-radius'),
        pill: '999px',
        card: token('card-radius'),
        kpi: token('kpi-radius'),
        header: token('header-radius'),
        sidebar: token('sidebar-radius'),
        menu: token('menu-radius'),
        drawer: token('drawer-radius'),
        tabs: token('tabs-radius'),
      },
      boxShadow: {
        card: token('card-shadow'),
        header: token('header-shadow'),
        sidebar: token('sidebar-shadow'),
        menu: token('menu-shadow'),
        drawer: token('drawer-shadow'),
        toast: token('drawer-shadow'),
      },
      height: {
        control: token('control-height'),
        'control-sm': token('control-height-sm'),
        header: token('layout-header-height'),
        dock: token('dock-height'),
      },
      minHeight: {
        touch: token('touch-target'),
        control: token('control-height'),
      },
      minWidth: {
        touch: token('touch-target'),
      },
      width: {
        sidebar: token('layout-sidebar-width'),
        rail: token('layout-rail-width'),
      },
      maxWidth: {
        content: token('layout-content-max'),
      },
      zIndex: {
        header: token('z-header'),
        sidebar: token('z-sidebar'),
        dock: token('z-dock'),
        menu: token('z-menu'),
        modal: token('z-modal'),
        toast: token('z-toast'),
      },
      screens: {
        // Abaixo de 768px vale o Dock flutuante; a partir daqui, o layout desktop.
        md: '768px',
        lg: '1024px',
      },
    },
  },
  plugins: [],
}
