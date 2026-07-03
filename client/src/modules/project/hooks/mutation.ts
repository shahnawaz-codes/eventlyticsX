import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, updateProject } from "../project.service";

export const useCreateProject = () => {
  // to perfrom invalidation__
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useDeleteProject = () => {
  // to perfrom invalidation__
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      projectName,
    }: {
      projectId: string;
      projectName: string;
    }) => updateProject(projectId, projectName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
