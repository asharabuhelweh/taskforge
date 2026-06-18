import { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { type Task } from "../types/domain";

interface TaskListItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
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

const TaskListItemComponent = ({ task, onEdit, onDelete }: TaskListItemProps) => {
  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    onDelete(task);
  }, [onDelete, task]);

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              ml: { xs: "auto", sm: 0 },
            }}
          >
            <Tooltip title="Edit task">
              <IconButton
                onClick={handleEdit}
                size="small"
                color="primary"
                aria-label={`edit ${task.title}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton
                onClick={handleDelete}
                size="small"
                color="error"
                aria-label={`delete ${task.title}`}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const TaskListItem = memo(TaskListItemComponent);
