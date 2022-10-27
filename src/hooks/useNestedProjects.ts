import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import { getNestedProjects } from '@/utils/api';
import { useMemo } from 'react';

type Filters = Parameters<typeof getNestedProjects>[3];

export default function useNestedProjects(filters?: Filters) {
    const { data: projects } = useProjects();
    const { data: tasks } = useTasks();
    const { data: timelogs } = useTimelogs();

    return useMemo(
        () => getNestedProjects(projects, tasks, timelogs, filters),
        [projects, tasks, timelogs, filters]
    );
}
