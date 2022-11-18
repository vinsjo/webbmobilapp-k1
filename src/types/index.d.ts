declare interface User {
    id: number;
    name: string;
}

declare interface Project {
    id: number;
    userId: User['id'];
    name: string;
    color: string;
    hourlyRate?: number;
}
declare interface Task {
    id: number;
    userId: User['id'];
    projectId: Project['id'];
    title: string;
}
declare interface Timelog {
    id: number;
    userId: User['id'];
    projectId: Project['id'];
    taskId: Task['id'];
    /** Timelog start time as a unix timestamp */
    start: number;
    /** Timelog end time as a unix timestamp, or 0 if Timelog is not ended */
    end: number;
}
