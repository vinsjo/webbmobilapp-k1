import { Outlet } from 'react-router-dom';
import { TimeTrackerProvider } from '@/context/TimeTracker';
import Layout from '@/components/Layout';

const Root = () => {
    return (
        <TimeTrackerProvider>
            <Layout>
                <Outlet />
            </Layout>
        </TimeTrackerProvider>
    );
};

export default Root;
