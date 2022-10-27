import { Stack } from '@mantine/core';
import SelectProject from '@/components/input/SelectProject';
import AddProject from '@/components/input/AddProject';
import AddTask from '@/components/input/AddTask';
import { useProjects } from '@/context/TimeTracker';
import useNestedProjects from '@/hooks/useNestedProjects';
import ProjectList from '@/components/list/ProjectList';

export default function Home() {
    const { selected } = useProjects();
    const projects = useNestedProjects({
        projects: !selected?.id ? false : ({ id }) => id === selected.id,
    });
    return (
        <Stack spacing="lg">
            <SelectProject />
            <AddProject />
            {selected?.id && <AddTask projectId={selected.id} />}
            <ProjectList projects={projects} />
        </Stack>
    );
}
