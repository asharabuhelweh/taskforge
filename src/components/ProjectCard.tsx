import { memo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { type Project } from "../types/domain";

interface ProjectCardProps {
  project: Project;
}

const ProjectCardComponent = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleOpenProject = useCallback(() => {
    navigate(`/projects/${project.id}`);
  }, [navigate, project.id]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "background.paper",
        borderColor: "divider",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 2,
          transform: "translateY(-4px)",
        },
        "&:hover .project-card-arrow": {
          opacity: 1,
          transform: "translateX(2px)",
        },
      }}
    >
      <CardActionArea
        onClick={handleOpenProject}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 0,
        }}
      >
        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: "text.primary",
                fontWeight: 700,
                lineHeight: 1.3,
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              {project.title}
            </Typography>
            <Chip
              label={`${project.tasks.length}`}
              size="small"
              sx={{
                height: 24,
                minWidth: 32,
                borderRadius: 999,
                bgcolor: "rgba(37, 99, 235, 0.1)",
                color: "primary.main",
                fontSize: "0.75rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              flexGrow: 1,
            }}
          >
            {project.description}
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {project.tasks.length} {project.tasks.length === 1 ? "task" : "tasks"}
            </Typography>
            <ArrowForwardIcon
              className="project-card-arrow"
              sx={{
                color: "primary.main",
                fontSize: 20,
                opacity: 0,
                transform: "translateX(0)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const ProjectCard = memo(ProjectCardComponent);
