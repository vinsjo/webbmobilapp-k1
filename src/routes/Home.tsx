import { useCallback } from 'react';

import {
    useProjects,
    useTasks,
    useTimelogs,
    type TimeTracker,
} from '@/context/TimeTracker';

import { Stack } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import AddProject from '@/components/input/AddProject';
import AddTask from '@/components/input/AddTask';
import ProjectList from '@/components/list/ProjectList';

import { filterData } from '@/utils';

import type { Task, Timelog } from '@/utils/api/types';

export default function Home() {
    const { selected } = useProjects();
    const filterSelector = useCallback(
        function <T extends Task | Timelog>({ data }: TimeTracker.Context<T>) {
            return !selected?.id
                ? []
                : filterData(data, 'projectId', selected.id);
        },
        [selected?.id]
    );
    const tasks = useTasks(filterSelector);
    const timelogs = useTimelogs(filterSelector);
    return (
        <Stack spacing="lg">
            <SelectProject />
            <AddProject />
            {selected?.id && (
                <>
                    <AddTask projectId={selected.id} />
                    <ProjectList
                        projects={[selected]}
                        tasks={tasks}
                        timelogs={timelogs}
                    />
                </>
            )}
        </Stack>
    );
}
