/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        trc: {
          DEFAULT: '#6C2BD9',
          dark: '#5519b8',
          darker: '#400f9a',
          light: '#8B52E8',
          accent: '#9B6FF5',
          muted: '#F3EEFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'trc-gradient': 'linear-gradient(135deg, #6C2BD9 0%, #4a1a9e 100%)',
        'trc-hero':   'linear-gradient(160deg, #2a0f5c 0%, #1a0a3d 60%, #0f0626 100%)',
      },
      boxShadow: {
        'trc-btn':         '0 4px 14px rgba(108,43,217,0.40)',
        'trc-btn-hover':   '0 6px 22px rgba(108,43,217,0.55)',
        'trc-card':        '0 20px 60px rgba(0,0,0,0.12)',
        'trc-input-focus': '0 0 0 3px rgba(108,43,217,0.14)',
        'trc-testimonial': '0 24px 64px rgba(0,0,0,0.28)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease both',
        'fade-in':   'fadeIn 0.4s ease both',
        'float':     'float 6s ease-in-out infinite',
        'spin-slow': 'spin 1.6s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
