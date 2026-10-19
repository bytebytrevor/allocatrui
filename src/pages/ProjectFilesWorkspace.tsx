import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { RefreshCwIcon } from "lucide-react";
import api from "@/api/axios";
import type { Project } from "@/Types/project";
import type { Task } from "@/Types/task";
import type { ProjectFile } from "@/Types/projectFile";
import ProjectFilesPanel from "@/components/ProjectFilesPanel";
import { FilePreviewDialog } from "@/components/FilePreview";
import { quietAction } from "@/components/workspace-ui";
export default function ProjectFilesWorkspace() {
  const { projectId } = useParams();
  // Supplied by the existing Dashboard Outlet.
  const { currentProject } = useOutletContext<{
    currentProject: Project;
  }>();
  if (!projectId || currentProject.id !== projectId)
    return (
      <p className="text-sm text-muted-foreground">
        Select a project to view its files.
      </p>
    );
  return <FilesWorkspace key={projectId} project={currentProject} />;
}
function FilesWorkspace({ project }: { project: Project }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksError, setTasksError] = useState(false);
  const [reload, setReload] = useState(0);
  const [preview, setPreview] = useState<ProjectFile | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setTasksError(false);
    void api
      .get<Task[]>(`/projects/tasks/${project.id}`, {
        withCredentials: true,
        signal: controller.signal,
      })
      .then((response) => {
        if (!controller.signal.aborted)
          setTasks(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setTasksError(true);
      });
    return () => controller.abort();
  }, [project.id, reload]);
  useEffect(() => {
    function changed(event: Event) {
      if (
        (
          event as CustomEvent<{
            projectId: string;
          }>
        ).detail?.projectId === project.id
      )
        setPreview(null);
    }
    window.addEventListener("allocatr:files-changed", changed);
    return () => window.removeEventListener("allocatr:files-changed", changed);
  }, [project.id]);
  return (
    <div className="min-w-0 pb-6">
      {tasksError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-border bg-card p-4 text-xs leading-6"
        >
          <p>
            Task filters could not be loaded. You can still browse project
            files.
          </p>
          <button
            type="button"
            onClick={() => setReload((value) => value + 1)}
            className={`${quietAction} mt-2`}
          >
            <RefreshCwIcon size={13} aria-hidden="true" />
            Retry task filters
          </button>
        </div>
      )}
      <div className="min-w-0">
        <div className="min-w-0">
          <ProjectFilesPanel
            workspaceHeader={{
              projectTitle: project.title,
              managerPath: `/projects/${project.id}`,
            }}
            projectId={project.id}
            tasks={tasks}
            onPreview={setPreview}
            onRemoved={(id) => {
              if (preview?.id === id) setPreview(null);
            }}
            onOpenTask={(taskId, commentId) => {
              const params = new URLSearchParams({ taskId });
              if (commentId) params.set("commentId", commentId);
              navigate(`/projects/${project.id}?${params.toString()}`);
            }}
          />
        </div>
        {preview && (
          <FilePreviewDialog file={preview} onClose={() => setPreview(null)} />
        )}
      </div>
    </div>
  );
}
