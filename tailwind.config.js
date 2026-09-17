/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta em ameixa e rosé: acolhedora, mas sóbria o suficiente para um
        // prontuário. Todos os pares de texto e fundo passam no WCAG AA.
        primary: {
          DEFAULT: '#4A2B4A',
          hover: '#3C223C',
        },
        accent: {
          DEFAULT: '#A8326B',
          hover: '#8E2A5B',
          pressed: '#77234C',
          soft: '#FBEFF5',
        },
        canvas: '#FBF7F9',
        surface: '#FFFFFF',
        ink: '#2B2430',
        muted: '#7A6B77',
        line: '#EDE3E9',
        success: '#15803D',
        warning: '#B45309',
        danger: {
          DEFAULT: '#C81E3C',
          hover: '#A81833',
        },
        // Cinzas levemente amalvados, para não destoarem do restante da paleta.
        // Substituem o cinza padrão do Tailwind em todo o sistema.
        slate: {
          50: '#FAF6F8',
          100: '#F4EEF2',
          200: '#E8DCE4',
          300: '#D3C2CD',
          400: '#96808E',
          500: '#7E6B77',
          600: '#63525C',
          700: '#4E3F48',
          800: '#382C33',
          900: '#251C21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'SF Pro Text', '-apple-system', 'system-ui', 'sans-serif'],
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
      },
      boxShadow: {
        card: '0 1px 3px rgba(74,43,74,0.06)',
        modal: '0 10px 30px rgba(74,43,74,0.14)',
        toast: '0 4px 16px rgba(74,43,74,0.14)',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}
