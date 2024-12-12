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
			},
			root: {
				"base": "relative h-full w-full",
				"leftControl": "absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
				"rightControl": "absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none"
			},

			indicators: {
				"active": {
					"off": "bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
					"on": "bg-white dark:bg-gray-800"
				},
				"base": "h-3 w-3 rounded-full",
				"wrapper": "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3"
			},
			item: {
				"base": "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2",
				"wrapper": {
					"off": "w-full flex-shrink-0 transform cursor-default snap-center",
					"on": "w-full flex-shrink-0 transform cursor-grab snap-center"
				}
			},
			control: {
				"base": "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
				"icon": "h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6"
			},
			scrollContainer: {
				"base": "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth ",
				"snap": "snap-x"
			}

		},

	},
	plugins: [daisyui, require("tailwindcss-animate")],
}