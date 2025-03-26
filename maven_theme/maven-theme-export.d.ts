/**
 * Maven Theme TypeScript Definitions
 */

export interface MavenColors {
	primary: {
		10: string;
		20: string;
		30: string;
		40: string;
		50: string;
	};
	neutral: {
		10: string;
		20: string;
		25: string;
		30: string;
		40: string;
		50: string;
		60: string;
		70: string;
	};
	system: {
		error: string;
		30: string;
		40: string;
		50: string;
	};
	pink: {
		10: string;
		20: string;
		30: string;
	};
	orange: {
		10: string;
		20: string;
		30: string;
	};
	blue: {
		10: string;
		20: string;
		30: string;
	};
	purple: {
		10: string;
		30: string;
	};
	gold: {
		10: string;
		30: string;
	};
	red: {
		10: string;
	};
	supplemental: {
		darkBlue: string;
		darkGreen: string;
		darkPurple: string;
	};
	video: {
		secondaryBackground: string;
		hover: string;
		pressedState: string;
	};
	legacyToReplace: {
		primary50: string;
		errorMain: string;
		buttonDisabled: string;
		buttonSecondary: string;
	};
}

export interface MavenTypography {
	fontFamily: {
		sansSerif: {
			normal: string;
			italic: string;
			semibold: string;
			bold: string;
		};
		serif: {
			normal: string;
			medium: string;
			bold: string;
		};
	};
	fontSize: {
		text: {
			xs: string;
			sm: string;
			md: string;
			normal: string;
			lg: string;
		};
		header: {
			h1: string;
			h2: string;
			h3: string;
			h4: string;
			h5: string;
			h6: string;
			subheader: string;
			h1Mobile: string;
			h2Mobile: string;
		};
	};
	lineHeight: {
		text: {
			xs: string;
			sm: string;
			md: string;
			normal: string;
			lg: string;
		};
		header: {
			h1: string;
			h2: string;
			h3: string;
			h4: string;
			h5: string;
			h6: string;
			subheader: string;
			h1Mobile: string;
			h2Mobile: string;
		};
	};
	base: {
		fontSize: string;
		lineHeight: number;
		letterSpacing: string;
	};
}

export interface MavenSpacing {
	1: string;
	2: string;
	3: string;
	4: string;
	5: string;
	6: string;
	7: string;
	8: string;
	10: string;
	11: string;
	12: string;
	14: string;
	16: string;
	20: string;
	24: string;
	32: string;
}

export interface MavenBreakpoints {
	mobile: {
		normal: string;
		md: string;
		max: string;
		landscape: string;
		landscapeMax: string;
	};
	tablet: {
		normal: string;
		max: string;
	};
	desktop: {
		normal: string;
	};
}

export interface MavenHeaderHeights {
	mobile: string;
	mobileLandscape: string;
	tablet: string;
	desktop: string;
	desktopFertilityPortal: string;
}

export interface MavenMeasurements {
	containerWidth: string;
	textContainerWidth: string;
	sidePanelWidth: string;
	smallCardWidth: string;
	footerHeight: string;
}

export interface MavenBorders {
	radius: {
		small: string;
		medium: string;
		large: string;
	};
}

export interface MavenShadows {
	light: string;
	medium: string;
	heavy: string;
}

export interface MavenMuiTheme {
	palette: {
		primary: {
			main: string;
			50: string;
		};
		secondary: {
			main: string;
		};
		error: {
			main: string;
		};
	};
	typography: {
		fontFamily: string;
		fontSize: string;
	};
	overrides: {
		MuiButton: {
			root: {
				borderRadius: string;
				textTransform: string;
				minWidth: string;
			};
			contained: {
				boxShadow: string;
			};
		};
	};
}

export interface MavenTheme {
	colors: MavenColors;
	typography: MavenTypography;
	spacing: MavenSpacing;
	breakpoints: MavenBreakpoints;
	headerHeights: MavenHeaderHeights;
	measurements: MavenMeasurements;
	borders: MavenBorders;
	shadows: MavenShadows;
	muiTheme: MavenMuiTheme;
}

export const mavenTheme: MavenTheme;

/**
 * Helper function to generate CSS variables from the theme
 * @returns A string of CSS variables
 */
export function generateCssVariables(): string;

/**
 * Example of using the theme in styled-components
 */
export const styledComponentsExample: string;
