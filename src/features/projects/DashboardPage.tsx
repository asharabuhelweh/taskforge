import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProjectStore } from "./project.store";
import { ProjectCard } from "../../components/ProjectCard";
import { fetchProjects } from "../../utils/api";
import { PageContainer } from "../../styles/styled";

const projectSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

type ProjectFormValues = yup.InferType<typeof projectSchema>;

const ProjectCardSkeleton = () => (
  <Card variant="outlined" sx={{ minHeight: 180, overflow: "hidden" }}>
    <CardContent sx={{ p: 3 }}>
      <Skeleton variant="text" width="65%" height={30} />
      <Skeleton variant="rounded" width={84} height={24} sx={{ mt: 1.5, mb: 2 }} />
      <Skeleton variant="text" width="95%" />
      <Skeleton variant="text" width="78%" />
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const projects = useProjectStore((state) => state.projects);
  const addProject = useProjectStore((state) => state.addProject);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    fetchProjects().then(() => setIsLoading(false));
  }, []);

  const handleOpen = useCallback(() => setIsModalOpen(true), []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    reset();
  }, [reset]);

  const onSubmit = useCallback(
    (values: ProjectFormValues) => {
      addProject(values.title, values.description);
      handleClose();
    },
    [addProject, handleClose],
  );

  return (
    <PageContainer>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            boxShadow: 1,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 3,
              p: 3,
              "&:last-child": { pb: 3 },
            }}
          >
            <Box>
              <Typography variant="h5" component="h1">
                Projects
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Track active work and open project task lists.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              size="large"
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                px: 3,
              }}
            >
              New Project
            </Button>
          </CardContent>
        </Card>

        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Grid item xs={12} sm={6} lg={4} key={n}>
                <ProjectCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <Card variant="outlined" sx={{ bgcolor: "rgba(37, 99, 235, 0.02)" }}>
            <CardContent sx={{ py: 8, px: 3, textAlign: "center" }}>
              <Box
                aria-hidden="true"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <FolderOpenIcon />
              </Box>
              <Typography variant="h6">No projects yet</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Create your first project to start organizing tasks.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                size="large"
                sx={{ px: 3 }}
              >
                New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} lg={4} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Create New Project</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogContent>
              <Stack spacing={2.5}>
                <TextField
                  autoFocus
                  label="Project Title"
                  fullWidth
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </PageContainer>
  );
}
