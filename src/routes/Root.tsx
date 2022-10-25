import { Outlet } from 'react-router-dom';
import { TimeTrackerProvider } from '@/components/providers';
import Layout from '@/components/Layout';

export default function Root() {
    return (
        <TimeTrackerProvider>
            <Layout>
                <Outlet />
            </Layout>
        </TimeTrackerProvider>
    );
}
