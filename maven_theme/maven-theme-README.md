# Maven Theme Export

This package provides the Maven Design System theme in various exportable formats that can be used in other applications.

## Files Included

- `maven-theme-export.js` - JavaScript/TypeScript implementation of the theme
- `maven-theme.css` - CSS Variables implementation of the theme

## Using the JavaScript/TypeScript Theme

The JavaScript/TypeScript implementation provides the theme as a JavaScript object that can be imported into your application. This is particularly useful for projects using styled-components, emotion, or other CSS-in-JS libraries.

```javascript
import { mavenTheme } from './maven-theme-export';

// Access theme values
const primaryColor = mavenTheme.colors.primary[30]; // #00856f
const fontSize = mavenTheme.typography.fontSize.text.normal; // 1rem
const spacing = mavenTheme.spacing[4]; // 1rem
```

### Styled Components Example

The file includes an example of how to use the theme with styled-components:

```javascript
import { mavenTheme } from './maven-theme-export';
import styled from 'styled-components';

export const Button = styled.button`
	background-color: ${mavenTheme.colors.primary[30]};
	color: ${mavenTheme.colors.neutral[10]};
	padding: ${mavenTheme.spacing[2]} ${mavenTheme.spacing[4]};
	border-radius: ${mavenTheme.borders.radius.large};
	font-family: ${mavenTheme.typography.fontFamily.sansSerif.semibold};
	font-size: ${mavenTheme.typography.fontSize.text.normal};
	border: none;
	cursor: pointer;

	&:hover {
		background-color: ${mavenTheme.colors.primary[40]};
	}

	&:disabled {
		background-color: ${mavenTheme.colors.legacyToReplace.buttonDisabled};
		cursor: not-allowed;
	}
`;
```

### Generating CSS Variables

The file also includes a utility function to generate CSS Variables from the theme:

```javascript
import { generateCssVariables } from './maven-theme-export';

// Generate CSS variables string
const cssVariables = generateCssVariables();

// You can then inject this into your application
const styleElement = document.createElement('style');
styleElement.innerHTML = cssVariables;
document.head.appendChild(styleElement);
```

## Using the CSS Implementation

For projects that prefer CSS Variables, you can import the `maven-theme.css` file directly into your application:

```html
<link rel="stylesheet" href="path/to/maven-theme.css" />
```

or in your CSS:

```css
@import 'path/to/maven-theme.css';
```

Then you can use the CSS variables in your stylesheets:

```css
.my-button {
	background-color: var(--color-primary-30);
	color: var(--color-neutral-10);
	padding: var(--spacing-2) var(--spacing-4);
	border-radius: var(--radius-large);
	font-family: var(--font-family-sans-semibold);
}
```

## Theme Structure

The Maven theme includes the following key sections:

### Colors

```javascript
mavenTheme.colors.primary;
mavenTheme.colors.neutral;
mavenTheme.colors.system;
mavenTheme.colors.pink;
mavenTheme.colors.orange;
// ... and more
```

### Typography

```javascript
mavenTheme.typography.fontFamily;
mavenTheme.typography.fontSize;
mavenTheme.typography.lineHeight;
mavenTheme.typography.base;
```

### Spacing

```javascript
mavenTheme.spacing[1]; // 0.25rem (4px)
mavenTheme.spacing[2]; // 0.5rem (8px)
mavenTheme.spacing[4]; // 1rem (16px)
// ... and more
```

### Breakpoints

```javascript
mavenTheme.breakpoints.mobile;
mavenTheme.breakpoints.tablet;
mavenTheme.breakpoints.desktop;
```

### Borders and Shadows

```javascript
mavenTheme.borders.radius;
mavenTheme.shadows;
```

## Font Requirements

The Maven theme uses the following font families:

- Proxima Nova (Regular, Italic, SemiBold, Bold)
- Domaine Display (Regular, Medium, ExtraBold)

You'll need to include these fonts in your project to fully match the Maven design system.

## Implementation Notes

The theme has been extracted from the Maven Web project and may not include all design tokens or variations used throughout the application. It represents the core design system as implemented in the UI package.

If you need to customize the theme for your application, you can extend or modify the theme object as needed.

## License

This theme is proprietary and should only be used within authorized Maven projects or as explicitly permitted.
