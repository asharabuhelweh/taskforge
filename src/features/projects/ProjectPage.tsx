import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useProjectStore } from "./project.store";
import { TaskListItem } from "../../components/TaskListItem";
import { type Task } from "../../types/domain";
import { PageContainer } from "../../styles/styled";

const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  status: yup
    .mixed<"todo" | "inProgress" | "done">()
    .oneOf(["todo", "inProgress", "done"])
    .required("Status is required"),
  dueDate: yup.string().required("Due date is required"),
});

type TaskFormValues = yup.InferType<typeof taskSchema>;

type DeleteTarget =
  | {
      type: "project";
      id: string;
      title: string;
      taskCount: number;
    }
  | {
      type: "task";
      id: string;
      projectId: string;
      title: string;
    };

const TaskSkeleton = () => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        "&:last-child": { pb: 3 },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="50%" height="1.75rem" />
        <Skeleton variant="text" width="30%" />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="rectangular" width="4.375rem" height="1.5rem" sx={{ borderRadius: "62.4375rem" }} />
        <Skeleton variant="circular" width="1.875rem" height="1.875rem" />
      </Box>
    </CardContent>
  </Card>
);

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const addTask = useProjectStore((state) => state.addTask);
  const updateTask = useProjectStore((state) => state.updateTask);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const deleteTask = useProjectStore((state) => state.deleteTask);

  const project = projects.find((p) => p.id === id);

  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | Task["status"]>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues: { title: "", status: "todo", dueDate: "" },
  });

  useEffect(() => {
    let isMounted = true;

    loadProjects().finally(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadProjects]);

  const displayedTasks = useMemo(() => {
    if (!project) return [];
    let filtered = project.tasks;
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [project, filterStatus, sortOrder]);

  const handleBack = useCallback(() => navigate("/dashboard"), [navigate]);

  const handleDeleteProject = useCallback(() => {
    if (!project) return;

    setDeleteTarget({
      type: "project",
      id: project.id,
      title: project.title,
      taskCount: project.tasks.length,
    });
  }, [project]);

  const handleOpenNew = useCallback(() => {
    setEditingTask(null);
    reset({ title: "", status: "todo", dueDate: "" });
    setIsModalOpen(true);
  }, [reset]);

  const handleOpenEdit = useCallback(
    (task: Task) => {
      setEditingTask(task);
      reset({ title: task.title, status: task.status, dueDate: task.dueDate });
      setIsModalOpen(true);
    },
    [reset],
  );

  const handleClose = useCallback(() => setIsModalOpen(false), []);

  const handleDeleteTask = useCallback(
    (task: Task) => {
      if (!id) return;

      setDeleteTarget({
        type: "task",
        id: task.id,
        projectId: id,
        title: task.title,
      });
    },
    [id],
  );

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "project") {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
      navigate("/dashboard");
      return;
    }

    await deleteTask(deleteTarget.projectId, deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteProject, deleteTarget, deleteTask, navigate]);

  const onSubmit = useCallback(
    async (values: TaskFormValues) => {
      if (!project) return;
      if (editingTask) {
        await updateTask(
          project.id,
          editingTask.id,
          values.title,
          values.status,
          values.dueDate,
        );
      } else {
        await addTask(project.id, values.title, values.status, values.dueDate);
      }
      handleClose();
    },
    [addTask, editingTask, handleClose, project, updateTask],
  );

  if (isLoading && !project) {
    return (
      <PageContainer>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height="2rem" />
              <Skeleton variant="text" width="65%" />
            </CardContent>
          </Card>
          {[1, 2, 3].map((n) => (
            <TaskSkeleton key={n} />
          ))}
        </Box>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h5" color="error">
          Project not found
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }} variant="contained">
          Go back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Card
          variant="outlined"
          sx={{
            mb: 3,
            boxShadow: 1,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              p: 3,
              "&:last-child": { pb: 3 },
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Chip
                label={`${project.tasks.length} ${project.tasks.length === 1 ? "task" : "tasks"}`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: 1.5 }}
              />
              <Typography variant="h5" component="h1">
                {project.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {project.description}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenNew}
                size="large"
                sx={{
                  flexGrow: { xs: 1, sm: 0 },
                  px: 3,
                }}
              >
                New Task
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteProject}
                size="large"
                sx={{
                  flexGrow: { xs: 1, sm: 0 },
                  minWidth: { xs: 0, sm: "7.25rem" },
                  px: 2.5,
                }}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              p: 2.5,
              "&:last-child": { pb: 2.5 },
            }}
          >
            <TextField
              select
              size="small"
              label="Filter Status"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | Task["status"])
              }
              sx={{ minWidth: { xs: "100%", sm: "11.25rem" } }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inProgress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Sort Due Date"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              sx={{ minWidth: { xs: "100%", sm: "11.25rem" } }}
            >
              <MenuItem value="asc">Earliest First</MenuItem>
              <MenuItem value="desc">Latest First</MenuItem>
            </TextField>
          </CardContent>
        </Card>

        {isLoading ? (
          [1, 2, 3].map((n) => <TaskSkeleton key={n} />)
        ) : displayedTasks.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ py: 6, px: 3, textAlign: "center" }}>
              <Typography variant="h6">No tasks match your criteria</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Change the filter or create a new task.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          displayedTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
            />
          ))
        )}

        <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogContent>
              <Stack spacing={2.5}>
                <TextField
                  label="Task Title"
                  fullWidth
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
                <TextField
                  select
                  label="Status"
                  fullWidth
                  defaultValue="todo"
                  {...register("status")}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </TextField>
                <TextField
                  type="date"
                  label="Due Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("dueDate")}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={!!deleteTarget}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              pb: 1,
            }}
          >
            {deleteTarget?.type === "project" ? "Delete project" : "Delete task"}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "text.primary", fontWeight: 600 }}>
              {deleteTarget?.type === "project"
                ? `Delete "${deleteTarget.title}" and its ${
                    deleteTarget.taskCount === 1
                      ? "1 task"
                      : `${deleteTarget.taskCount} tasks`
                  }?`
                : `Delete "${deleteTarget?.title}"?`}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              sx={{ px: 2.5 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
}
