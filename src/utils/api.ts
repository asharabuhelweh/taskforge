import { type Project } from "../types/domain";
import { loadFromStorage } from "./persist";

const PROJECTS_KEY = "taskforge_projects";
const SIMULATED_DELAY_MS = 800;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProjects = async (): Promise<Project[]> => {
  await delay(SIMULATED_DELAY_MS);
  return loadFromStorage<Project[]>(PROJECTS_KEY, []);
};
