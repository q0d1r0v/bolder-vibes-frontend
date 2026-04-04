import { useMutation } from '@tanstack/react-query';
import { deployProject, downloadProject } from '@/lib/api/deploy.api';
import type { DeployRequest } from '@/lib/api/deploy.api';

export function useDeployProject(projectId: string) {
  return useMutation({
    mutationFn: (data: DeployRequest) => deployProject(projectId, data),
  });
}

export function useDownloadProject(projectId: string) {
  return useMutation({
    mutationFn: () => downloadProject(projectId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });
}
