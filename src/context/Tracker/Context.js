import { createContext } from 'react';

/**
 * @typedef {{id:string,name:string,color:string|null}} Project
 * @typedef {{id:string,projectId:string,title:string}} Task
 * @typedef {{id:string,taskId:string,start:number,end:number}} Timelog
 */

/**
 * @type {projects:Project[],tasks:Task[],timelogs:Timelog[]}
 */
const defaultValue = {
    projects: [],
    tasks: [],
    timelogs: [],
};

const TrackerContext = createContext(defaultValue);

export default TrackerContext;
