import daisyui from './node_modules/daisyui'

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
    	extend: {
    		colors: {
    			'main-brown': '#564941',
    			'main-orange': '#F69946',
    			'secondary-orange': '#F8B374',
    			'light-orange': '#FFF8F1',
    			'secondary-brown': '#807571',
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		boxShadow: {
    			'box-btn': '0 4px 0 100% rgba(0, 0, 0, 0.3)'
    		},
    		dropShadow: {
    			drop: '0 35px 35px rgba(0, 0, 0, 0.25)',
    			'4xl': ['0 35px 35px rgba(0, 0, 0, 0.25)', '0 45px 65px rgba(0, 0, 0, 0.15)']
    		},
    		textColor: {
    			'main-brown': '#564941',
    			'main-orange': '#F69946',
    			'secondary-orange': '#F8B374',
    			'light-orange': '#FFF8F1',
    			'secondary-brown': '#807571'
    		}
    	}
    },
	plugins: [daisyui, require("tailwindcss-animate")],
}