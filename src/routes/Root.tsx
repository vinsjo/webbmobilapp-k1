import { Outlet } from 'react-router-dom';
import { TimeTrackerProvider, ThemeProvider } from '@/components/providers';
import Layout from '@/components/Layout';

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
