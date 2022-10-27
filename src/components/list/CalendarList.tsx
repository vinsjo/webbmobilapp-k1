import dayjs from 'dayjs';
import ProjectList from './ProjectList';
import useNestedProjects from '@/hooks/useNestedProjects';

type Props = { selectedDate: Date | null };

export default function CalendarList({ selectedDate }: Props) {
    const projects = useNestedProjects({
        projects: ({ tasks }) => tasks.length,
        tasks: ({ timelogs }) => timelogs.length,
        timelogs: ({ start, end }) =>
            selectedDate && end && dayjs(start).isSame(selectedDate, 'date'),
    });

    return <ProjectList projects={projects} />;
}
