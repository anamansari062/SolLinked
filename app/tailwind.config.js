module.exports = {
    purge: [
        './public/index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    content: [],
    theme: {
        extend: {},
    },
    plugins: [],

    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            'white': '#ffffff',
            'purple': '#DC1FFF',
            'blue': {
                500: '#67e8f9',
                700: '#03E1FF',
            },
            'green': '#00FFA3',
            'black': '#000000',
            'gray': {
                50: '#9ca3af',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#64748b',
            }

        },
    },
}