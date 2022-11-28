import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingOverlay from '@/components/LoadingOverlay';
import { getAllData } from '@/utils/api';
import { useEffect, useState } from 'react';

const ThemeProvider = React.lazy(
    () => import('../components/providers/ThemeProvider')
);
const Layout = React.lazy(() => import('../components/Layout'));
const TimeTrackerProvider = React.lazy(
    () => import('../components/providers/TimeTrackerProvider')
);

export default function Root() {
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState<Api.DbData>();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllData();
                if (!data) throw 'failed loading initial data';
                setData(data);
            } catch (err) {
                console.error(err instanceof Error ? err.message : err);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);
    return (
        <Suspense fallback={<LoadingOverlay label='Loading interface' />}>
            <ThemeProvider>
                {!loaded ? (
                    <LoadingOverlay label='Loading data' visible={!loaded} />
                ) : (
                    <TimeTrackerProvider initialData={data}>
                        <Layout>
                            <Outlet />
                        </Layout>
                    </TimeTrackerProvider>
                )}
            </ThemeProvider>
        </Suspense>
    );
}
