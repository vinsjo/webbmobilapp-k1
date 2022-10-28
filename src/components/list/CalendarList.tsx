import { useCallback } from 'react';
import { useTimelogs, useProjects, useTasks } from '@/context/TimeTracker';
import dayjs from 'dayjs';
import ProjectList from './ProjectList';

type Props = { selectedDate: Date | string | null };

export default function CalendarList({ selectedDate }: Props) {
    const timelogs = useTimelogs(
        useCallback(
            ({ data }) =>
                !selectedDate
                    ? []
                    : data.filter(
                          ({ start, end }) =>
                              end && dayjs(start).isSame(selectedDate, 'date')
                      ),
            [selectedDate]
        )
    );
    const tasks = useTasks(
        useCallback(
            ({ data }) =>
                !timelogs.length
                    ? []
                    : data.filter(({ id }) =>
                          timelogs.find(({ taskId }) => taskId === id)
                      ),
            [timelogs]
        )
    );

    const projects = useProjects(
        useCallback(
            ({ data }) =>
                !tasks.length
                    ? []
                    : data.filter(({ id }) =>
                          tasks.find(({ projectId }) => projectId === id)
                      ),
            [tasks]
        )
    );

    return (
        <ProjectList projects={projects} tasks={tasks} timelogs={timelogs} />
    );
}
