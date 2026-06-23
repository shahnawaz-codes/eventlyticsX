import { api } from "@/lib/axios";

export const createProject = async (projectName: string) => {
  const { data } = await api.post("/projects", { projectName });
  return data.data;
};

// all projects
export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.data;
};

// particular project
export const getProjectDetail = async (projectId: string) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.data;
};

export const deleteProject = async (projectId: string) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data;
};
