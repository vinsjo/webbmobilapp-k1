import { useCallback } from 'react';
import { Text, Tabs, type TabsValue } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

const Overview = () => {
    const navigate = useNavigate();
    const { activeTab } = useParams();
    const handleTabChange = useCallback(
        (tab: TabsValue) => {
            navigate(`/overview/${tab || 'projects'}`);
        },
        [navigate]
    );
    return (
        <Tabs
            defaultValue="projects"
            value={activeTab}
            onTabChange={handleTabChange}
        >
            <Tabs.List>
                <Tabs.Tab value="projects">Projects</Tabs.Tab>
                <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="projects">Projects</Tabs.Panel>
            <Tabs.Panel value="tasks">Tasks</Tabs.Panel>
        </Tabs>
    );
};

export default Overview;
