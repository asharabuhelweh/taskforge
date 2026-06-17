import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

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

const LoginDashboardPreview = () => {
  return (
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
          filter: "blur(5.5px)",
          transform: "scale(1.05)",
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
  );
};

export default LoginDashboardPreview;
