import { Outlet } from 'react-router-dom';
import { ThemeProvider, TimeTrackerProvider } from '@/components/providers';
import Layout from '@/components/Layout';
import LoadingOverlay from '@/components/LoadingOverlay';
import axios from 'axios';
import { API_URL } from '@/utils/api/config';
import { getAllData } from '@/utils/api';
import { useEffect, useMemo, useState } from 'react';

export default function Root() {
    const [serverIsAwake, setServerIsAwake] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState<Api.DbData>();
    const loadingLabel = useMemo(() => {
        if (!serverIsAwake) return 'Connecting to server...';
        if (!loaded) return 'Loading data...';
        return null;
    }, [serverIsAwake, loaded]);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                await axios.head(API_URL, { signal: controller.signal });
            } catch (err) {
                if (axios.isCancel(err)) return;
                console.error(err instanceof Error ? err.message : err);
            } finally {
                setServerIsAwake(true);
            }
        })();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!serverIsAwake) return;
        (async () => {
            try {
                const data = await getAllData();
                if (!data) throw 'failed loading data';
                setData(data);
            } catch (err) {
                console.error(err instanceof Error ? err.message : err);
            } finally {
                setLoaded(true);
            }
        })();
    }, [serverIsAwake]);
    return (
        <ThemeProvider>
            <Layout>
                {!loaded ? (
                    <LoadingOverlay visible={!loaded} label={loadingLabel} />
                ) : (
                    <TimeTrackerProvider initialData={data}>
                        <Outlet />
                    </TimeTrackerProvider>
                )}
            </Layout>
        </ThemeProvider>
    );
}
