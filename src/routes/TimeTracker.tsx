import { useEffect, useState } from 'react';
import { useProjects, useTasks, useTimelogs } from '@/context/TimeTracker';
import LoadingOverlay from '@/components/LoadingOverlay';

import TimeTrackerDashboard from '@/components/TimeTrackerDashboard';

export default function TimeTracker() {
    const { loaded: projectsLoaded } = useProjects();
    const { loaded: tasksLoaded } = useTasks();
    const { loaded: timelogsLoaded } = useTimelogs();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(projectsLoaded && tasksLoaded && timelogsLoaded);
    }, [projectsLoaded, tasksLoaded, timelogsLoaded]);

    return !loaded ? <LoadingOverlay /> : <TimeTrackerDashboard />;
}
