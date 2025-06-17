import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            backgroundImage: {
                'red-gradient': 'linear-gradient(135deg, rgb(170, 50, 50) 0%, rgb(220, 70, 70) 100%)',
                'red-gradient-100': 'linear-gradient(135deg, rgb(180, 60, 60) 0%, rgb(225, 75, 75) 100%)',
                'amber-gradient': 'linear-gradient(to right, #f59e0b 0%, #f59e0b 100%)',
            },
            animation: {
                gradient: 'gradient 3s ease infinite',
            },
            keyframes: {
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            backgroundSize: {
                '200': '200%',
                '300': '300%',
                '400': '400%',
            },
            colors: {
                red: {
                    100: '#ff0000',
                    200: '#ff0000',
                    300: '#ff0000',
                    400: '#ff0000',
                    500: '#ff0000',
                    600: '#ff3333',
                    700: '#ff8585',
                    800: '#ffadad',
                    900: '#ffd6d6',
                },
                darkred: {
                    100: '#e50000',
                    200: '#cc0000',
                    300: '#b30000',
                    400: '#990000',
                    500: '#7f0000',
                    600: '#660000',
                    700: '#4d0000',
                    800: '#330000',
                    900: '#1a0000',
                },
                darkgreen: {
                    100: '#00ff00',
                    200: '#00e500',
                    300: '#00cc00',
                    400: '#00b300',
                    500: '#009900',
                    600: '#007f00',
                    700: '#006600',
                    800: '#004d00',
                    900: '#003300',
                },
                wht: {
                    100: '#ffffff',
                    200: '#e8e8e8',
                    300: '#d6d6d6',
                    400: '#cacaca',
                    500: '#c2c2c2',
                    600: '#bfbfbf',
                    700: '#c2c2c2',
                    800: '#cacaca',
                    900: '#d6d6d6',
                },
                gray: {
                    800: '#1E1E1E',
                    900: '#151515',
                    700: '#2C2C2C',
                    600: '#3A3A3A',
                },
                primary: '#38bdf8',
                secondary: '#64748b',
                darkBg: '#111827',
                darkCard: '#1f2937',
                darkText: '#d1d5db',
                redAccent: '#ef4444',
                greenAccent: '#10b981',
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [forms],
};