export interface Task {
    id: string;
    projectId: string;
    title: string;
    start: number;
    end: number | null;
}

export interface Project {
    id: string;
    name: string;
    color?: string;
    tasks?: Task[];
}

export interface ProjectWithTasks extends Project {
    tasks: Task[];
}

export interface RequestError {
    status: number;
    statusText?: string;
    message: string;
}
