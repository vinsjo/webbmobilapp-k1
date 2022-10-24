import { useContext } from 'react';
import { ProjectsContext, TasksContext, TimelogsContext } from './Context';

export const useProjects = () => useContext(ProjectsContext);
export const useTasks = () => useContext(TasksContext);
export const useTimelogs = () => useContext(TimelogsContext);
