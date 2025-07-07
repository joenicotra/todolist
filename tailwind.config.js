/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'things': {
          'blue': '#007AFF',
          'blue-light': '#4A90E2',
          'blue-pressed': '#0051D5',
          'orange': '#FF9500',
          'red': '#FF3B30',
          'green': '#34C759',
          'teal': '#5AC8FA',
          'yellow': '#FFCC00',
          'purple': '#AF52DE',
          'white': '#FFFFFF',
          'light-gray': '#F2F2F7',
          'medium-gray': '#E5E5EA',
          'dark-gray': '#8E8E93',
          'charcoal': '#3C3C43',
          'black': '#000000',
        }
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '14px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '28px',
      },
      spacing: {
        '60': '240px', // Sidebar width
      },
      boxShadow: {
        'things': '0 1px 3px rgba(0,0,0,0.1)',
        'things-hover': '0 2px 8px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        '150': '150ms',
      }
    },
  },
  plugins: [],
}
