"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteProject } from "@/hooks/queries/use-projects";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export function DeleteProjectDialog({
  open,
  onClose,
  projectId,
  projectName,
}: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  const handleConfirm = () => {
    deleteProject.mutate(projectId, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete project"
      description={`Are you sure you want to delete "${projectName}"? This action cannot be undone.`}
      confirmLabel="Delete"
      loading={deleteProject.isPending}
      danger
    />
  );
}
