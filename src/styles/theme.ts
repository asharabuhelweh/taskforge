import { createTheme, alpha } from "@mui/material";

const palette = {
  light: {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    secondary: "#64748B",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
    bgDefault: "#F8FAFC",
    bgPaper: "#FFFFFF",
  },
  dark: {
    primary: "#60A5FA",
    primaryDark: "#3B82F6",
    secondary: "#94A3B8",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    border: "#334155",
    bgDefault: "#0F172A",
    bgPaper: "#1E293B",
  },
};

const elevations = {
  none: "none",
  sm: "0 0.0625rem 0.125rem rgba(15, 23, 42, 0.05)",
  md: "0 0.25rem 0.75rem rgba(15, 23, 42, 0.08)",
  lg: "0 0.75rem 1.5rem rgba(15, 23, 42, 0.12)",
  xl: "0 1.25rem 2.5rem rgba(15, 23, 42, 0.16)",
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.light.primary,
      dark: palette.light.primaryDark,
    },
    secondary: {
      main: palette.light.secondary,
    },
    background: {
      default: palette.light.bgDefault,
      paper: palette.light.bgPaper,
    },
    text: {
      primary: palette.light.textPrimary,
      secondary: palette.light.textSecondary,
    },
    divider: palette.light.border,
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.01rem",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.005rem",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: 0,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01rem",
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: palette.light.border,
          boxShadow: elevations.sm,
          transition:
            "box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          fontWeight: 600,
          transition: "all 0.2s ease",
        },
        sizeLarge: {
          height: "3rem",
          fontSize: "1rem",
          padding: "0.75rem 1.5rem",
        },
        sizeMedium: {
          height: "2.5rem",
          padding: "0.5rem 1rem",
        },
        sizeSmall: {
          height: "2rem",
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
        },
        contained: {
          boxShadow: elevations.md,
          "&:hover": {
            boxShadow: elevations.lg,
            transform: "translateY(-0.0625rem)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderWidth: "0.09375rem",
          "&:hover": {
            borderWidth: "0.09375rem",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "62.4375rem",
        },
        sizeSmall: {
          height: "1.5rem",
          fontSize: "0.75rem",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.75rem",
            backgroundColor: palette.light.bgPaper,
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.light.primary,
              },
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 0.1875rem ${alpha(palette.light.primary, 0.1)}`,
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "1rem",
          boxShadow: elevations.xl,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 700,
          padding: "1.5rem 1.5rem 0.75rem",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0.75rem 1.5rem",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "1rem 1.5rem 1.5rem",
          gap: "0.75rem",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: palette.dark.primary,
      dark: palette.dark.primaryDark,
    },
    secondary: {
      main: palette.dark.secondary,
    },
    background: {
      default: palette.dark.bgDefault,
      paper: palette.dark.bgPaper,
    },
    text: {
      primary: palette.dark.textPrimary,
      secondary: palette.dark.textSecondary,
    },
    divider: palette.dark.border,
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.01rem",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.005rem",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: 0,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01rem",
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: palette.dark.border,
          boxShadow: "0 0.25rem 0.75rem rgba(0, 0, 0, 0.3)",
          transition:
            "box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          fontWeight: 600,
          transition: "all 0.2s ease",
        },
        sizeLarge: {
          height: "3rem",
          fontSize: "1rem",
          padding: "0.75rem 1.5rem",
        },
        sizeMedium: {
          height: "2.5rem",
          padding: "0.5rem 1rem",
        },
        sizeSmall: {
          height: "2rem",
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
        },
        contained: {
          boxShadow: "0 0.25rem 0.75rem rgba(96, 165, 250, 0.3)",
          "&:hover": {
            boxShadow: "0 0.5rem 1rem rgba(96, 165, 250, 0.4)",
            transform: "translateY(-0.0625rem)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderWidth: "0.09375rem",
          "&:hover": {
            borderWidth: "0.09375rem",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: "62.4375rem",
        },
        sizeSmall: {
          height: "1.5rem",
          fontSize: "0.75rem",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.75rem",
            backgroundColor: palette.dark.bgPaper,
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.dark.primary,
              },
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 0.1875rem ${alpha(palette.dark.primary, 0.2)}`,
            },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "1rem",
          boxShadow: "0 1.25rem 2.5rem rgba(0, 0, 0, 0.5)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
          fontWeight: 700,
          padding: "1.5rem 1.5rem 0.75rem",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0.75rem 1.5rem",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "1rem 1.5rem 1.5rem",
          gap: "0.75rem",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
  },
});
