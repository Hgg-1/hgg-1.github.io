/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  corePlugins: {
    preflight: false, // 禁用 Tailwind 的基础样式重置，以避免与 Arco Design 冲突
  },
  theme: {
    extend: {
      colors: {
        'primary': '#FF6B6B', // 活力粉红
        'secondary': '#4ECDC4', // 清新薄荷绿
        'accent': '#FFE66D', // 明亮黄色
        'dark': '#292F36', // 深色文本
        'light': '#F7FFF7', // 浅色背景
      },
      backgroundImage: {
        'pattern-1': "url('/background/5996ee1bcf6ba61d7148243b7424cfc.jpg')",
        'pattern-2': "url('/background/fbf109bebb36f75f4a0ac30a6cf1d4f.jpg')",
      },
      animation: {
        slideshow: 'slideshow 10s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        bounce: 'bounce 2s infinite',
      },
      keyframes: {
        slideshow: {
          '0%, 100%': {
            backgroundImage: "url('/background/5996ee1bcf6ba61d7148243b7424cfc.jpg')",
          },
          '50%': {
            backgroundImage: "url('/background/fbf109bebb36f75f4a0ac30a6cf1d4f.jpg')",
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      fontFamily: {
        'cute': ['Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [],
}; 