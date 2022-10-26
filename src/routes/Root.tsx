import { Outlet } from 'react-router-dom';
import { ThemeProvider, TimeTrackerProvider } from '@/components/providers';
import Layout from '@/components/Layout';

export default function Root() {
    return (
        <ThemeProvider>
            <TimeTrackerProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </TimeTrackerProvider>
        </ThemeProvider>
    );
}
