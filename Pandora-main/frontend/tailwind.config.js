// tailwind.config.js
module.exports = {
  mode: 'jit',
  purge: [
    // Paths to your templates
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    // other plugins
  ],
}
