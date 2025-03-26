import { extendTheme } from '@chakra-ui/react';

const mavenTheme = extendTheme({
  colors: {
    primary: {
      10: '#f1f7f6',
      20: '#d6ebe8',
      30: '#00856f',
      40: '#005d4e',
      50: '#00413e',
    },
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
    system: {
      error: '#cb4c48',
      30: '#ca4742',
      40: '#af3631',
      50: '#9f312d',
    },
  },
  fonts: {
    heading: "'proximanova-semibold', 'Helvetiva Neue', Arial, sans-serif",
    body: "'proximanova-regular', 'Helvetiva Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'full',
      },
      variants: {
        solid: {
          bg: 'primary.30',
          color: 'white',
          _hover: {
            bg: 'primary.40',
          },
          _active: {
            bg: 'primary.50',
          },
          _disabled: {
            bg: '#99CEC5',
            _hover: { bg: '#99CEC5' },
          },
        },
        ghost: {
          color: 'neutral.60',
          _hover: {
            bg: 'primary.10',
          },
        },
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 'full',
      },
      variants: {
        ghost: {
          _hover: {
            bg: 'primary.10',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'neutral.60',
        fontFamily: 'heading',
      },
    },
    Text: {
      baseStyle: {
        color: 'neutral.60',
        fontFamily: 'body',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'neutral.10',
        color: 'neutral.60',
      },
    },
  },
});

export default mavenTheme; 