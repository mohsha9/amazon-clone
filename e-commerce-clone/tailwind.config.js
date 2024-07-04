/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'checkout-grid-col': '1fr 350px',
        'checkout-grid-col2': '1fr',
        'checkout-product-grid': '100px 1fr',
        'checkout-product-grid2': '100px 1fr 1fr',
        'delivery-option-grid': '24px 1fr',
        'payment-grid': '1fr auto'
      },
      gridRowStart: {
        '1': '1'
      },
      gridRowEnd: {
        '0': '0'
      },
      screens: {
        'xs': '460px',
        'xs1': '580px'
      }
    },
  },
  plugins: [],
}

