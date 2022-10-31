import { useCallback } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Tabs, Stack, Group, Text } from '@mantine/core';
import { useProjects, useTasks } from '@/context/TimeTracker';
import { defaultColor } from '@/utils/api';
import { ProjectModal, TaskModal } from '@/components/modals';
import { FaEdit } from 'react-icons/fa';

export default function Overview() {
    const { data: projects } = useProjects();
    const { data: tasks } = useTasks();
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
            <Tabs.List grow>
                <Tabs.Tab value="projects">
                    <Text size="lg">Projects</Text>
                </Tabs.Tab>
                <Tabs.Tab value="tasks">
                    <Text size="lg">Tasks</Text>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="projects">
                <Stack py="xl">
                    {!projects.length ? (
                        <Text>No projects exist</Text>
                    ) : (
                        projects.map(({ id, name, color }) => {
                            return (
                                <Group
                                    position="apart"
                                    p="md"
                                    key={`project-${id}`}
                                    sx={(theme) => ({
                                        borderRadius: theme.radius.sm,
                                        background: color,
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
                        })
                    )}
                </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="tasks">
                <Stack py="xl">
                    {!tasks.length ? (
                        <Text>No tasks exist</Text>
                    ) : (
                        tasks.map(({ id, title, projectId }) => {
                            const color =
                                projects.find(({ id }) => projectId === id)
                                    ?.color || defaultColor;
                            return (
                                <Group
                                    position="apart"
                                    p="md"
                                    key={`project-${id}`}
                                    sx={(theme) => ({
                                        borderRadius: theme.radius.sm,
                                        background: color,
                                    })}
                                >
                                    <Text>{title}</Text>
                                    <TaskModal.Edit
                                        id={id}
                                        variant="subtle"
                                        p="xs"
                                    >
                                        <FaEdit />
                                    </TaskModal.Edit>
                                </Group>
                            );
                        })
                    )}
                </Stack>
            </Tabs.Panel>
        </Tabs>
    );
}
