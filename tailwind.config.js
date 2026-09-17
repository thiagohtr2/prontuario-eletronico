/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          hover: '#17304f',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          pressed: '#1E40AF',
          soft: '#EFF6FF',
        },
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        ink: '#1E293B',
        muted: '#64748B',
        line: '#E2E8F0',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
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
        card: '0 1px 3px rgba(0,0,0,0.05)',
        modal: '0 10px 30px rgba(15,23,42,0.12)',
        toast: '0 4px 16px rgba(15,23,42,0.12)',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}
