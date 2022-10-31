import { useCallback } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Tabs, Stack, Group, Text } from '@mantine/core';
import { useProjects, useTasks } from '@/context/TimeTracker';
import { Colors, defaultColor } from '@/utils/api';
import { ProjectModal, TaskModal } from '@/components/modals';
import { FaEdit } from 'react-icons/fa';

export default function Overview() {
    const projects = useProjects();
    const tasks = useTasks();
    const navigate = useNavigate();
    const { activeTab } = useParams();

    const handleTabChange = useCallback(
        (tab: string) => navigate(`/overview/${tab}`),
        [navigate]
    );

    return !activeTab ? (
        <Navigate to={'/overview/projects'} replace />
    ) : (
        <Tabs
            defaultValue="projects"
            value={activeTab}
            onTabChange={handleTabChange}
        >
            <Tabs.List>
                <Tabs.Tab value="projects">Projects</Tabs.Tab>
                <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="projects">
                <Stack py="xl">
                    {projects.data.map(({ id, name, color }) => {
                        return (
                            <Group
                                position="apart"
                                p="md"
                                key={`project-${id}`}
                                sx={(theme) => ({
                                    borderRadius: theme.radius.sm,
                                    background: !color
                                        ? defaultColor
                                        : Colors[color],
                                })}
                            >
                                <Text>{name}</Text>
                                <ProjectModal.Edit
                                    id={id}
                                    variant="subtle"
                                    p="xs"
                                >
                                    <FaEdit />
                                </ProjectModal.Edit>
                            </Group>
                        );
                    })}
                </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="tasks">
                <Stack py="xl">
                    {tasks.data.map(({ id, title }) => {
                        return (
                            <Group
                                position="apart"
                                p="md"
                                key={`project-${id}`}
                                sx={(theme) => ({
                                    borderRadius: theme.radius.sm,
                                    background: defaultColor,
                                })}
                            >
                                <Text>{title}</Text>
                                <TaskModal.Edit id={id} variant="subtle" p="xs">
                                    <FaEdit />
                                </TaskModal.Edit>
                            </Group>
                        );
                    })}
                </Stack>
            </Tabs.Panel>
        </Tabs>
    );
}
