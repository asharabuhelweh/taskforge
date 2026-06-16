import { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { type Task } from "../types/domain";

interface TaskListItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusColors: Record<Task["status"], "default" | "primary" | "success"> = {
  todo: "default",
  inProgress: "primary",
  done: "success",
};

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

const statusAccent: Record<Task["status"], string> = {
  todo: "divider",
  inProgress: "primary.main",
  done: "success.main",
};

const TaskListItemComponent = ({ task, onEdit }: TaskListItemProps) => {
  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderLeft: "0.25rem solid",
        borderLeftColor: statusAccent[task.status],
        bgcolor: "background.paper",
        borderColor: "divider",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-0.125rem)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontSize: "1rem",
              color: "text.primary",
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", sm: "flex-end" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Chip
            label={statusLabels[task.status]}
            color={statusColors[task.status]}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <IconButton
            onClick={handleEdit}
            size="small"
            color="primary"
            aria-label="edit task"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export const TaskListItem = memo(TaskListItemComponent);
