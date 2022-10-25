import { useCallback } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Tabs, List } from '@mantine/core';
import { useProjects, useTasks } from '@/context/TimeTracker';

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
                <List listStyleType="none">
                    {projects.data.map(({ id, name, color }) => {
                        return (
                            <List.Item
                                key={`project-${id}`}
                                color={color || undefined}
                            >
                                {name}
                            </List.Item>
                        );
                    })}
                </List>
            </Tabs.Panel>
            <Tabs.Panel value="tasks">
                <List listStyleType="none">
                    {tasks.data.map(({ id, title }) => {
                        return (
                            <List.Item key={`project-${id}`}>{title}</List.Item>
                        );
                    })}
                </List>
            </Tabs.Panel>
        </Tabs>
    );
}
