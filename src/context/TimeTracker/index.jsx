import { createContext, useContext, useMemo } from 'react';
import useAxios from '@vinsjo/use-axios';

/**
 * @type    {{
 *              projects: {id:string,name:string,color:string|null}[],
 *              tasks: {id:string,projectId:string,title:string}[],
 *              timelogs: {id:string,taskId:string,start:number,end:number}[]
 *          }}
 */
const defaultValue = {
    projects: [],
    tasks: [],
    timelogs: [],
};

export const TimeTrackerContext = createContext(defaultValue);

/** @param {"projects"|"tasks"|"timelogs"} path */
const axiosConfig = (path) => {
    const baseURL = 'http://localhost:3000';
    return { url: `${baseURL}/${path}`, waitUntilMount: true };
};

/**
 * @param {{children:React.ReactNode}} props
 */
export default function TimeTrackerProvider({ children }) {
    const projects = useAxios(axiosConfig('projects'));
    const tasks = useAxios(axiosConfig('tasks'));
    const timelogs = useAxios(axiosConfig('timelogs'));

    const value = useMemo(
        () => ({
            projects: projects.data || [],
            tasks: tasks.data || [],
            timelogs: timelogs.data || [],
        }),
        [projects.data, tasks.data, timelogs.data]
    );

    return (
        <TimeTrackerContext.Provider value={value}>
            {children}
        </TimeTrackerContext.Provider>
    );
}

export const useTimeTracker = () => useContext(TimeTrackerContext);
