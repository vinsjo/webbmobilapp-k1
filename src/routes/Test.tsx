import { useCallback } from 'react';

import {
    useProjects,
    useTasks,
    useTimelogs,
    type TimeTracker,
} from '@/context/TimeTracker';

import { Stack } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import AddTask from '@/components/input/AddTask';
import ProjectList from '@/components/list/ProjectList';

import { filterData } from '@/utils';

import type { Task, Timelog } from '@/utils/api/types';
import AddProjectModal from '@/components/input/AddProjectModal';

export default function Test() {
    const { selected } = useProjects();
    const filterSelector = useCallback(
        function <T extends Task | Timelog>({ data }: TimeTracker.Context<T>) {
            return !selected?.id
                ? []
                : filterData(data, 'projectId', selected.id);
        },
        [selected?.id]
    );
    const tasks = useTasks(filterSelector, (a, b) => a.data === b.data);
    const timelogs = useTimelogs(filterSelector, (a, b) => a.data === b.data);
    return (
        <Stack spacing="lg">
            <Stack spacing="lg">
                <SelectProject />
                <AddProjectModal />
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
        </Stack>
    );
}
