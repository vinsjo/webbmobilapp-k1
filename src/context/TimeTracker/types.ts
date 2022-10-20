export interface Project {
    id: string;
    name: string;
    color: string | null;
}
export interface Task {
    id: string;
    projectId: Project['id'];
    title: string;
}
export interface Timelog {
    id: string;
    taskId: Task['id'];
    projectId: Project['id'];
    start: number;
    end: number;
}
