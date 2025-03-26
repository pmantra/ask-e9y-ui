/**
 * Maven Theme Export
 *
 * This file contains an exportable version of the Maven design system that can be
 * used in other applications. It includes colors, typography, spacing, breakpoints,
 * and other design tokens.
 */

export const mavenTheme = {
	// Colors
	colors: {
		// Primary colors
		primary: {
			10: '#f1f7f6',
			20: '#d6ebe8',
			30: '#00856f',
			40: '#005d4e',
			50: '#00413e',
		},

		// Neutrals
		neutral: {
			10: '#ffffff',
			20: '#f6f6f6',
			25: '#e9ecec',
			30: '#dee3e3',
			40: '#b7c0c0',
			50: '#64726f',
			60: '#172321',
			70: '#111111',
		},

		// System colors
		system: {
			error: '#cb4c48',
			30: '#ca4742',
			40: '#af3631',
			50: '#9f312d',
		},

		// Pink colors
		pink: {
			10: '#fff0ee',
			20: '#d77979',
			30: '#c43c5c',
		},

		// Orange colors
		orange: {
			10: '#ffefde',
			20: '#fcb234',
			30: '#d66803',
		},

		// Blue colors
		blue: {
			10: '#e8f3ff',
			20: '#2962a5',
			30: '#2d2e76',
		},

		// Purple colors
		purple: {
			10: '#efecff',
			30: '#5f39cc',
		},

		// Gold colors
		gold: {
			10: '#fdf4da',
			30: '#be8119',
		},

		// Red colors
		red: {
			10: '#fde9e9',
		},

		// Supplemental colors
		supplemental: {
			darkBlue: '#0B45B7',
			darkGreen: '#054C45',
			darkPurple: '#5B3A91',
		},

		// Video colors
		video: {
			secondaryBackground: '#263331',
			hover: '#354341',
			pressedState: '#546360',
		},

		// Legacy colors to replace
		legacyToReplace: {
			primary50: '#8CBDA7',
			errorMain: '#ED6A5A',
			buttonDisabled: '#99CEC5',
			buttonSecondary: '#263633',
		},
	},

	// Typography
	typography: {
		// Font families
		fontFamily: {
			sansSerif: {
				normal: "'proximanova-regular', 'Helvetiva Neue', Arial, sans-serif",
				italic: "'proximanova-regularit', 'Helvetiva Neue', Arial, sans-serif",
				semibold: "'proximanova-semibold', 'Helvetiva Neue', Arial, sans-serif",
				bold: "'proximanova-bold', 'Helvetiva Neue', Arial, sans-serif",
			},
			serif: {
				normal: "'domaine-display-regular', Georgia, serif",
				medium: "'domaine-display-medium', Georgia, serif",
				bold: "'domaine-display-extra-bold', Georgia, serif",
			},
		},

		// Font sizes
		fontSize: {
			text: {
				xs: '0.625rem',
				sm: '0.75rem',
				md: '0.9rem',
				normal: '1rem',
				lg: '1.125rem',
			},
			header: {
				h1: '2.5rem',
				h2: '2rem',
				h3: '1.625rem',
				h4: '1.375rem',
				h5: '1.125rem',
				h6: '1rem',
				subheader: '0.875rem',
				h1Mobile: '1.625rem',
				h2Mobile: '1.625rem',
			},
		},

		// Line heights
		lineHeight: {
			text: {
				xs: '1.15rem',
				sm: '1.2rem',
				md: '1.5rem',
				normal: '1.5rem',
				lg: '1.5rem',
			},
			header: {
				h1: '3.25rem',
				h2: '2.6rem',
				h3: '2.1125rem',
				h4: '1.65rem',
				h5: '1.7875rem',
				h6: '1.3rem',
				subheader: '1.1375',
				h1Mobile: '2.1125rem',
				h2Mobile: '2.1125rem',
			},
		},

		// Base values
		base: {
			fontSize: '16px',
			lineHeight: 1.45,
			letterSpacing: '0rem',
		},
	},

	// Spacing
	spacing: {
		1: '0.25rem', // 4px
		2: '0.5rem', // 8px
		3: '0.75rem', // 12px
		4: '1rem', // 16px
		5: '1.25rem', // 20px
		6: '1.5rem', // 24px
		7: '1.75rem', // 28px
		8: '2rem', // 32px
		10: '2.5rem', // 40px
		11: '2.75rem', // 44px
		12: '3rem', // 48px
		14: '3.5rem', // 56px
		16: '4rem', // 64px
		20: '5rem', // 80px
		24: '6rem', // 96px
		32: '8rem', // 128px
	},

	// Breakpoints
	breakpoints: {
		mobile: {
			normal: '320px',
			md: '375px',
			max: '539px',
			landscape: '540px',
			landscapeMax: '767px',
		},
		tablet: {
			normal: '768px',
			max: '1023px',
		},
		desktop: {
			normal: '1024px',
		},
	},

	// Header heights
	headerHeights: {
		mobile: '56px',
		mobileLandscape: '64px',
		tablet: '72px',
		desktop: '80px',
		desktopFertilityPortal: '91px',
	},

	// Other measurements
	measurements: {
		containerWidth: '768px',
		textContainerWidth: '496px',
		sidePanelWidth: '482px',
		smallCardWidth: '256px',
		footerHeight: '48px',
	},

	// Borders
	borders: {
		radius: {
			small: '0.25rem',
			medium: '0.5rem',
			large: '1.5rem',
		},
	},

	// Shadows
	shadows: {
		light: '0 1px 2px 0 rgba(0, 0, 0, 0.06)',
		medium: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
		heavy: '0 2px 32px 0 rgba(0, 0, 0, 0.1)',
	},

	// Material UI theme overrides
	muiTheme: {
		palette: {
			primary: {
				main: '#00856f',
				50: '#8CBDA7',
			},
			secondary: {
				main: '#00413e',
			},
			error: {
				main: '#ED6A5A',
			},
		},
		typography: {
			fontFamily: "'proximanova-semibold', 'Helvetiva Neue', Arial, sans-serif",
			fontSize: '1rem',
		},
		overrides: {
			MuiButton: {
				root: {
					borderRadius: '24px',
					textTransform: 'initial',
					minWidth: '112px',
				},
				contained: {
					boxShadow: 'none',
				},
			},
		},
	},
};

/**
 * Helper function to generate CSS variables from the theme
 * This can be used to create a CSS file with all the theme variables
 */
export function generateCssVariables() {
	let cssVariables = ':root {\n';

	// Colors
	Object.entries(mavenTheme.colors).forEach(([colorGroup, colors]) => {
		if (typeof colors === 'object') {
			Object.entries(colors).forEach(([shade, value]) => {
				cssVariables += `  --color-${colorGroup}-${shade}: ${value};\n`;
			});
		}
	});

	// Typography
	cssVariables += '\n  /* Typography */\n';
	Object.entries(mavenTheme.typography.fontSize.text).forEach(([size, value]) => {
		cssVariables += `  --font-size-${size}: ${value};\n`;
	});

	Object.entries(mavenTheme.typography.fontSize.header).forEach(([size, value]) => {
		cssVariables += `  --font-size-${size}: ${value};\n`;
	});

	Object.entries(mavenTheme.typography.lineHeight.text).forEach(([size, value]) => {
		cssVariables += `  --line-height-${size}: ${value};\n`;
	});

	// Spacing
	cssVariables += '\n  /* Spacing */\n';
	Object.entries(mavenTheme.spacing).forEach(([key, value]) => {
		cssVariables += `  --spacing-${key}: ${value};\n`;
	});

	// Borders
	cssVariables += '\n  /* Borders */\n';
	Object.entries(mavenTheme.borders.radius).forEach(([size, value]) => {
		cssVariables += `  --radius-${size}: ${value};\n`;
	});

	// Shadows
	cssVariables += '\n  /* Shadows */\n';
	Object.entries(mavenTheme.shadows).forEach(([intensity, value]) => {
		cssVariables += `  --shadow-${intensity}: ${value};\n`;
	});

	cssVariables += '}\n';
	return cssVariables;
}

/**
 * Example of using the theme in styled-components
 */
export const styledComponentsExample = `
import { mavenTheme } from './maven-theme-export';
import styled from 'styled-components';

// Example of using the theme in styled-components
export const Button = styled.button\`
  background-color: \${mavenTheme.colors.primary[30]};
  color: \${mavenTheme.colors.neutral[10]};
  padding: \${mavenTheme.spacing[2]} \${mavenTheme.spacing[4]};
  border-radius: \${mavenTheme.borders.radius.large};
  font-family: \${mavenTheme.typography.fontFamily.sansSerif.semibold};
  font-size: \${mavenTheme.typography.fontSize.text.normal};
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: \${mavenTheme.colors.primary[40]};
  }
  
  &:disabled {
    background-color: \${mavenTheme.colors.legacyToReplace.buttonDisabled};
    cursor: not-allowed;
  }
\`;

// Example of a media query using breakpoints
export const ResponsiveContainer = styled.div\`
  padding: \${mavenTheme.spacing[4]};
  
  @media (min-width: \${mavenTheme.breakpoints.tablet.normal}) {
    padding: \${mavenTheme.spacing[8]};
  }
  
  @media (min-width: \${mavenTheme.breakpoints.desktop.normal}) {
    padding: \${mavenTheme.spacing[12]};
  }
\`;
`;

// For usage examples, see the README.md or documentation
