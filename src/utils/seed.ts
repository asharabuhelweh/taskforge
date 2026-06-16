import { type Project } from "../types/domain.ts";

export const seedProjects: Project[] = [
    {
        id: "p1",
        title: "Website Redesign",
        description: "Redesign the company website with new branding",
        tasks: [
            {
                id: "t1",
                title: "Create wireframes",
                status: "done",
                dueDate: "2026-06-10",
            },
            {
                id: "t2",
                title: "Design homepage",
                status: "inProgress",
                dueDate: "2026-06-20",
            },
            {
                id: "t3",
                title: "Implement responsive layout",
                status: "todo",
                dueDate: "2026-06-25",
            },
        ],
    },
    {
        id: "p2",
        title: "Mobile App",
        description: "Build a cross-platform mobile application",
        tasks: [
            {
                id: "t4",
                title: "Set up project structure",
                status: "done",
                dueDate: "2026-06-08",
            },
            {
                id: "t5",
                title: "Build login screen",
                status: "todo",
                dueDate: "2026-06-22",
            },
        ],
    },
];
