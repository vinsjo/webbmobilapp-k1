import { Outlet } from 'react-router-dom';
import TimeTrackerProvider from '@/components/providers/TimeTrackerProvider';
import Layout from '@/components/Layout';
import ThemeProvider from '@/components/providers/ThemeProvider';

export default function Root() {
    return (
        <TimeTrackerProvider>
            <ThemeProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </ThemeProvider>
        </TimeTrackerProvider>
    );
}
