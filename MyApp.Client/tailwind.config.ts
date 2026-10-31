import { type Config } from 'tailwindcss'

export default {
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        pre: {
                            overflowX: 'auto',
                            maxWidth: 'calc(100vw - 1rem)',
                        },
                        code: {
                            color: theme('colors.blue.500'),
                            backgroundColor: theme('colors.blue.50'),
                            fontWeight: 'normal',
                            borderRadius: '.25rem',
                            padding: '.25em .5rem',
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            }),
            colors: {
                'link-dark': {
                    DEFAULT: '#087EA4',
                    dark: '#149ECA',
                },
            },
        },
    },
} satisfies Config
