'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    backgroundLight: {
      main: string;
    };
    backgroundDark: {
      main: string;
    };
    surfaceLight: {
      main: string;
    };
    surfaceDark: {
      main: string;
    };
    textLight: {
      main: string;
    };
    textDark: {
      main: string;
    };
    subtleLight: {
      main: string;
    };
    subtleDark: {
      main: string;
    };
    borderLight: {
      main: string;
    };
    borderDark: {
      main: string;
    };
  }
  interface PaletteOptions {
    backgroundLight?: {
      main: string;
    };
    backgroundDark?: {
      main: string;
    };
    surfaceLight?: {
      main: string;
    };
    surfaceDark?: {
      main: string;
    };
    textLight?: {
      main: string;
    };
    textDark?: {
      main: string;
    };
    subtleLight?: {
      main: string;
    };
    subtleDark?: {
      main: string;
    };
    borderLight?: {
      main: string;
    };
    borderDark?: {
      main: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC700',
      light: '#FFEC8A',
      dark: '#B38B00',
      contrastText: '#000000',
    },
    backgroundLight: {
      main: '#F9F9F9',
    },
    backgroundDark: {
      main: '#121212',
    },
    surfaceLight: {
      main: '#FFFFFF',
    },
    surfaceDark: {
      main: '#1C1C1C',
    },
    textLight: {
      main: '#18181B',
    },
    textDark: {
      main: '#E4E4E7',
    },
    subtleLight: {
      main: '#71717A',
    },
    subtleDark: {
      main: '#A1A1AA',
    },
    borderLight: {
      main: '#E4E4E7',
    },
    borderDark: {
      main: '#27272A',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC700',
      light: '#FFEC8A',
      dark: '#B38B00',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1C1C1C',
    },
    backgroundLight: {
      main: '#F9F9F9',
    },
    backgroundDark: {
      main: '#121212',
    },
    surfaceLight: {
      main: '#FFFFFF',
    },
    surfaceDark: {
      main: '#1C1C1C',
    },
    textLight: {
      main: '#18181B',
    },
    textDark: {
      main: '#E4E4E7',
    },
    subtleLight: {
      main: '#71717A',
    },
    subtleDark: {
      main: '#A1A1AA',
    },
    borderLight: {
      main: '#E4E4E7',
    },
    borderDark: {
      main: '#27272A',
    },
  },
});