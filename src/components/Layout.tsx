import { useCallback, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../contexts/theme-context";
import { useAuthStore } from "../features/auth/auth.store";

export const Layout = () => {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            component={Link}
            to="/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 800,
                fontSize: "0.9rem",
                boxShadow: "0 8px 18px rgba(37, 99, 235, 0.25)",
              }}
            >
              TF
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 1,
              }}
            >
              TaskForge
            </Typography>
          </Box>

          <Tooltip title="Toggle theme">
            <IconButton sx={{ mr: 1.5 }} onClick={toggleTheme} color="inherit">
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>

          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            sx={{
              px: 2,
              borderColor: "divider",
              color: "text.secondary",
              fontWeight: 500,
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(180deg, rgba(37, 99, 235, 0.04), rgba(248, 250, 252, 0) 260px)"
              : "linear-gradient(180deg, rgba(96, 165, 250, 0.08), rgba(15, 23, 42, 0) 260px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
