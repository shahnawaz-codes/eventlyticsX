import { useQuery } from "@tanstack/react-query";
import { getProjectDetail, getProjects } from "../project.service";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectDetail(id),
  });
};
