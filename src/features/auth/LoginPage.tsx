import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "./auth.store";
import LoginDashboardPreview from "./LoginDashboardPreview";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

const features = ["Project Tracking", "Task Management", "Progress Monitoring"];

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.email, values.password);

    if (!success) {
      setLoginError("Invalid email or password");
      return;
    }

    setLoginError("");
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8FAFC",
        px: { xs: 0, sm: 4, md: 6 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <LoginDashboardPreview />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(248, 250, 252, 0.34)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "73.75rem",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
        }}
      >
        <Box sx={{ display: { xs: "none", md: "block" } }} />

        <Card
          variant="outlined"
          sx={{
            width: { xs: "calc(100% - 32px)", sm: "100%" },
            maxWidth: "30rem",
            justifySelf: { xs: "center", md: "start" },
            transform: {
              md: "translateX(-3.5rem)",
              lg: "translateX(-3.75rem)",
            },
            borderRadius: "1.25rem",
            borderColor: "rgba(226, 232, 240, 0.9)",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow:
              "0 1.5rem 3.75rem rgba(15, 23, 42, 0.12), 0 0.5rem 1.5rem rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: "2.625rem",
                  height: "2.625rem",
                  borderRadius: "0.75rem",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "1rem",
                  boxShadow: "0 0.625rem 1.25rem rgba(37, 99, 235, 0.28)",
                }}
              >
                TF
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ color: "#0F172A", fontWeight: 700 }}
              >
                TaskForge
              </Typography>
            </Box>

            <Typography color="#64748B" sx={{ mb: 3, lineHeight: 1.6 }}>
              Manage projects, track tasks, and monitor team progress from one
              workspace.
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  size="medium"
                  {...register("email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  size="medium"
                  {...register("password")}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    height: "3.5rem",
                    mt: 0.5,
                    borderRadius: "0.875rem",
                    fontWeight: 700,
                    boxShadow: "0 0.75rem 1.5rem rgba(37, 99, 235, 0.22)",
                    "&:hover": {
                      bgcolor: "#1D4ED8",
                      boxShadow: "0 1rem 1.875rem rgba(37, 99, 235, 0.3)",
                    },
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Box>

            <Stack spacing={0.5} sx={{ mt: 2.5 }}>
              {features.map((feature) => (
                <Stack
                  key={feature}
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                >
                  <CheckCircleIcon
                    sx={{ color: "#94A3B8", fontSize: "1rem" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", fontSize: "0.8125rem" }}
                  >
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
