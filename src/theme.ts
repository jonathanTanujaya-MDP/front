
import { createTheme } from '@mui/material/styles';

// ☀️ Light Theme Definition (Reverted to previous readable state)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3F51B5', // Primary color for headers and key elements
    },
    secondary: {
      main: '#9FA8DA', // A softer, complementary blue for secondary elements
    },
    background: {
      default: '#f4f6f8', // A very light grey for the main background
      paper: '#ffffff',    // Pure white for cards and surfaces for max contrast
    },
    text: {
      primary: '#212121', // Dark text for readability on light backgrounds
      secondary: '#757575', // Darker secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#212121', // Ensure titles are dark
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#212121', // Ensure subtitles are dark
    },
    body1: {
      fontSize: '0.875rem',
      color: '#212121', // Ensure body text is dark
      lineHeight: 1.5,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#3F51B5',
          color: '#FFFFFF', // Ensure text on AppBar is white
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // Use paper color for cards
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', // Subtle shadow
        },
      },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                paddingLeft: '24px',
                '&:hover': {
                    backgroundColor: '#C5CAE9' // Reverted to previous subtle hover color
                },
                '&.Mui-selected': {
                    borderLeft: '4px solid #2979FF',
                    backgroundColor: '#E8EAF6',
                    color: '#3F51B5',
                    '& .MuiListItemIcon-root': {
                        color: '#3F51B5',
                    },
                },
            }
        }
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: '#607D8B',
            }
        }
    },
    MuiListItemText: {
        styleOverrides: {
            primary: {
                color: '#212121',
            },
            secondary: {
                color: '#757575',
            }
        }
    },
  },
});

//  Dark Theme Definition (Remains unchanged)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2979FF',
    },
    secondary: {
      main: '#90A4AE',
    },
    background: {
      default: '#1E2A38',
      paper: '#2C3E50',
    },
    text: {
      primary: '#ECEFF1',
      secondary: '#90A4AE',
    },
    success: {
        main: '#66BB6A',
    },
    error: {
        main: '#EF5350',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#ECEFF1',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#ECEFF1',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#90A4AE',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C3E50',
          color: '#ECEFF1',
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#1E2A38',
            }
        }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C3E50',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          backgroundImage: 'none'
        },
      },
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                paddingLeft: '24px',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)'
                },
                '&.Mui-selected': {
                    borderLeft: '4px solid #2979FF',
                    backgroundColor: '#2C3E50',
                    color: '#ECEFF1',
                    '& .MuiListItemIcon-root': {
                        color: '#ECEFF1',
                    },
                },
            }
        }
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: {
                color: '#90A4AE',
            }
        }
    },
    MuiListItemText: {
        styleOverrides: {
            primary: {
                color: '#ECEFF1',
            },
            secondary: {
                color: '#90A4AE',
            }
        }
    },
  },
});
