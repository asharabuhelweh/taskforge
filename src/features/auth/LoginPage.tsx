import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthStore } from "./auth.store";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

const projectCards = [
  { title: "Website Redesign", count: "3 tasks", status: "In Progress" },
  { title: "Mobile App", count: "2 tasks", status: "Planning" },
];

const taskColumns = [
  {
    title: "Todo",
    tasks: ["Create wireframes", "Build login screen"],
  },
  {
    title: "In Progress",
    tasks: ["Design homepage", "Task filters"],
  },
  {
    title: "Done",
    tasks: ["Set up project", "Theme toggle"],
  },
];

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

  const onSubmit = (values: LoginFormValues) => {
    const success = login(values.email, values.password);

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
        px: { xs: 2, sm: 4, md: 6 },
        py: 4,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          p: { xs: 2, md: 5 },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            height: "100%",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            borderColor: "#E2E8F0",
            filter: "blur(0.125rem)",
            transform: "scale(1.01)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ color: "#0F172A", fontWeight: 700 }}>
                  TaskForge Dashboard
                </Typography>
                <Typography color="#64748B">Team workspace overview</Typography>
              </Box>
              <Button variant="contained" size="small">
                New Project
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
              {projectCards.map((project) => (
                <Card key={project.title} variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ color: "#0F172A", mb: 1, fontWeight: 700 }}
                    >
                      {project.title}
                    </Typography>
                    <Typography color="#64748B" sx={{ mb: 2 }}>
                      {project.count}
                    </Typography>
                    <Chip
                      label={project.status}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(13.75rem, 1fr))",
                gap: 2,
                minWidth: "47.5rem",
              }}
            >
              {taskColumns.map((column) => (
                <Card key={column.title} variant="outlined">
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 600 }}>
                        {column.title}
                      </Typography>
                      <Chip label={column.tasks.length} size="small" />
                    </Stack>

                    {column.tasks.map((task, index) => (
                      <Card
                        key={task}
                        variant="outlined"
                        sx={{ mb: 2, bgcolor: "#FFFFFF" }}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Typography
                            variant="body2"
                            sx={{ color: "#0F172A", fontWeight: 700, mb: 1 }}
                          >
                            {task}
                          </Typography>
                          <Chip
                            label={index === 0 ? "High Priority" : column.title}
                            color={column.title === "Done" ? "success" : "primary"}
                            variant="outlined"
                            size="small"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(15, 23, 42, 0.16)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "73.75rem",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "55fr 45fr" },
          alignItems: "center",
        }}
      >
        <Box sx={{ display: { xs: "none", md: "block" } }} />

        <Card
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "30rem",
            justifySelf: { xs: "center", md: "start" },
            borderRadius: "1rem",
            borderColor: "rgba(226, 232, 240, 0.9)",
            bgcolor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(0.75rem)",
            boxShadow: "0 1.5rem 3rem rgba(15, 23, 42, 0.16)",
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
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
              <Typography variant="h4" component="h1" sx={{ color: "#0F172A", fontWeight: 700 }}>
                TaskForge
              </Typography>
            </Box>

            <Typography color="#64748B" sx={{ mb: 3, lineHeight: 1.6 }}>
              Manage projects, track tasks, and monitor team progress from one
              workspace.
            </Typography>

            <Stack spacing={1} sx={{ mb: 3 }}>
              {features.map((feature) => (
                <Stack key={feature} direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon sx={{ color: "#2563EB", fontSize: "1.125rem" }} />
                  <Typography variant="body2" sx={{ color: "#0F172A" }}>
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>

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
                    mt: 1,
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;
