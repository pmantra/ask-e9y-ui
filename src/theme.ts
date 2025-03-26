// src/theme.ts
import { extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/react';


const colors = {
  brand: {
    50: '#e6f5ff',
    100: '#cce8ff',
    200: '#99d1ff',
    300: '#66baff',
    400: '#3393ff',
    500: '#0062cc', // Primary blue from mvnapp.net
    600: '#0052b3',
    700: '#003d80',
    800: '#002952',
    900: '#001429',
  },
  primary: {
    10: '#e6f7f5',
    20: '#ccefeb',
    30: '#00856f', // Main brand color
    40: '#006a58',
    50: '#004f41',
  },
  neutral: {
    10: '#ffffff',
    20: '#f2f4f7',
    25: '#e4e7ec',
    30: '#d0d5dd',
    40: '#98a2b3',
    50: '#667085',
    60: '#475467',
  },
  // More corporate color palette
  gray: {
    50: '#f9fafb',
    100: '#f2f4f7',
    200: '#e4e7ec',
    300: '#d0d5dd',
    400: '#98a2b3',
    500: '#667085',
    600: '#475467',
    700: '#344054',
    800: '#1d2939',
    900: '#101828',
  },
  blue: {
    50: '#eff8ff',
    100: '#d1e9ff',
    500: '#2e90fa',
    600: '#1570cd',
    700: '#175cd3',
  },
  success: {
    50: '#ecfdf3',
    500: '#12b76a',
    700: '#027a48',
  },
  warning: {
    50: '#fffaeb',
    500: '#f79009',
    700: '#b54708',
  },
  error: {
    50: '#fef3f2',
    500: '#f04438',
    700: '#b42318',
  }
}

const theme = extendTheme({
  colors,
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  shadows: {
    sm: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
    md: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
    lg: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
          _active: {
            bg: 'brand.700',
          },
        },
        outline: {
          borderColor: 'gray.300',
          color: 'gray.700',
          _hover: {
            bg: 'gray.50',
          },
        },
        ghost: {
          color: 'gray.600',
          _hover: {
            bg: 'gray.50',
          },
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 3,
          py: 2,
        },
        md: {
          fontSize: 'md',
          px: 4,
          py: 2,
        },
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'md',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
        color: 'gray.900',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md',
        },
      },
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'md',
        px: 2,
        py: 0.5,
        fontWeight: 'medium',
      },
      variants: {
        subtle: (props: StyleFunctionProps) => ({
          bg: `${props.colorScheme}.50`,
          color: `${props.colorScheme}.700`,
        }),
      },
    },
    Divider: {
      baseStyle: {
        borderColor: 'gray.200',
      },
    },
    Menu: {
      baseStyle: {
        list: {
          borderColor: 'gray.200',
          shadow: 'md',
        },
        item: {
          _focus: {
            bg: 'gray.50',
          },
          _hover: {
            bg: 'gray.50',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
})

export default theme