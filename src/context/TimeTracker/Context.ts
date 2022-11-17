/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';

export const UsersContext = createContext<TimeTracker.Context<User> | null>(
    null
);
export const ProjectsContext =
    createContext<TimeTracker.Context<Project> | null>(null);
export const TasksContext = createContext<TimeTracker.Context<Task> | null>(
    null
);
export const TimelogsContext =
    createContext<TimeTracker.Context<Timelog> | null>(null);
