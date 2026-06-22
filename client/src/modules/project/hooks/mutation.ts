import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject } from "../project.service";

export const useCreateProject = () => {
  // to perfrom invalidation__
  const queryClient = useQueryClient();
  useMutation({
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
  useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
