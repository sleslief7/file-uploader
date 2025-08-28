import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: '#f9f6fe' },
          100: { value: '#e7dbfb' },
          200: { value: '#d2bbf8' },
          300: { value: '#b994f4' },
          400: { value: '#aa7df2' },
          500: { value: '#955def' },
          600: { value: '#813eec' },
          700: { value: '#6412e8' },
          800: { value: '#5000d2' },
          900: { value: '#3c009c' },
        },
        secondary: {
          50: { value: '#e6f0fa' },
          100: { value: '#c0d1f5' },
          200: { value: '#99b2f0' },
          300: { value: '#7393eb' },
          400: { value: '#4d74e6' },
          500: { value: '#2655e1' },
          600: { value: '#1f44b7' },
          700: { value: '#17348d' },
          800: { value: '#102463' },
          900: { value: '#081439' },
          950: { value: '#040a1a' },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          value: {
            _light: '{colors.primary.500}',
            _dark: '{colors.primary.300}',
          },
        },
        'primary.fg': {
          value: {
            _light: '{colors.primary.700}',
            _dark: '{colors.primary.300}',
          },
        },
        'primary.subtle': {
          value: {
            _light: '{colors.primary.100}',
            _dark: '{colors.primary.900}',
          },
        },
        'primary.muted': {
          value: {
            _light: '{colors.primary.200}',
            _dark: '{colors.primary.800}',
          },
        },
        'primary.border': {
          value: {
            _light: '{colors.primary.200}',
            _dark: '{colors.primary.600}',
          },
        },
        'primary.solid': {
          value: {
            _light: '{colors.primary.600}',
            _dark: '{colors.primary.600}',
          },
        },
        'primary.contrast': {
          value: {
            _light: 'white',
            _dark: 'white',
          },
        },
        'primary.emphasized': {
          value: {
            _light: '{colors.primary.300}',
            _dark: '{colors.primary.700}',
          },
        },
        'primary.focusRing': {
          value: {
            _light: '{colors.primary.500}',
            _dark: '{colors.primary.500}',
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
