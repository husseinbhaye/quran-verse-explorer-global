
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				quran: {
					primary: '#3F6473', // Changed from #625953 to a teal blue color
					secondary: '#D4B254', // Changed to a warmer gold
					light: '#F8F5E6', // Light cream
					dark: '#2D3748', // Dark slate
					accent: '#8A6642', // Warm brown accent
					gold: {
						DEFAULT: '#D4B254', // Warm gold
						light: '#F5EBBF', // Light gold
						dark: '#9E7A2D', // Dark gold
					},
					emerald: {
						DEFAULT: '#3F6473', // Changed from taupe to teal blue
						light: '#61879A', // Lighter version of teal blue
						dark: '#2C4751' // Darker version of teal blue
					},
					sand: {
						DEFAULT: '#E2D1C3', // Sand color
						light: '#F8F5E6', // Light sand
						medium: '#EFE8DB', // Medium sand tone
						beige: '#F5F0E5', // Beige sand
						cream: '#FFFBF0', // Cream sand
						dark: '#BFA68F' // Dark sand
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'marquee': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'pulse-gold': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 0 0 rgba(212, 178, 84, 0.7)'
					},
					'50%': { 
						opacity: '0.8',
						boxShadow: '0 0 0 10px rgba(212, 178, 84, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'marquee': 'marquee 20s linear infinite',
				'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			fontFamily: {
				arabic: ['Scheherazade New', 'serif'],
				sans: ['Inter', 'sans-serif']
			},
			backgroundImage: {
				'islamic-pattern': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"%3E%3Cg fill=\"%23d4b254\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M20 0L0 20h20zm0 40V20H0zm20-40v20h20zm0 40h20V20z\"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')",
				'arabesque': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"40\" viewBox=\"0 0 24 40\"%3E%3Cg fill=\"%238a6642\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L2 40L24 40L24 38L2 38L0 38L0 40ZM0 30L2 30L24 30L24 28L2 28L0 28L0 30ZM0 20L2 20L24 20L24 18L2 18L0 18L0 20ZM0 10L2 10L24 10L24 8L2 8L0 8L0 10Z\"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')",
				'moroccan': "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 80 80\"%3E%3Cg fill=\"%233f6473\" fill-opacity=\"0.07\"%3E%3Cpath d=\"M0 0h20v20H0V0zm10 17L3 10h14L10 17zM10 3l7 7H3l7-7zM30 0h20v20H30V0zm10 17l-7-7h14l-7 7zm0-14l7 7H33l7-7zM60 0h20v20H60V0zm10 17l-7-7h14l-7 7zm0-14l7 7H63l7-7zM0 30h20v20H0V30zm10 17l-7-7h14l-7 7zm0-14l7 7H3l7-7zM30 30h20v20H30V30zm10 17l-7-7h14l-7 7zm0-14l7 7H33l7-7zM60 30h20v20H60V30zm10 17l-7-7h14l-7 7zm0-14l7 7H63l7-7zM0 60h20v20H0V60zm10 17l-7-7h14l-7 7zm0-14l7 7H3l7-7zM30 60h20v20H30V60zm10 17l-7-7h14l-7 7zm0-14l7 7H33l7-7zM60 60h20v20H60V60zm10 17l-7-7h14l-7 7zm0-14l7 7H63l7-7z\"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')",
				'sand-gradient': 'linear-gradient(to right bottom, rgba(248, 245, 230, 0.8), rgba(226, 209, 195, 0.8))'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
