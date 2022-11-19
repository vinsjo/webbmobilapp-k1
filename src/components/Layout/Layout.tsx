import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Footer from './Footer';
import Header from './Header';
import { useUsers } from '@/context/TimeTracker';
import UserModal from '../modals/UserModal';

export default function Layout(props: React.PropsWithChildren) {
    const users = useUsers();
    const { pathname } = useLocation();
    const [openModal, setOpenModal] = useState(false);
    const activePath = useMemo(() => {
        const basePath = pathname.split('/').filter((p) => p)[0] || '';
        return `/${basePath}`;
    }, [pathname]);

    const pageTitle = useMemo(() => {
        switch (activePath) {
            case '/calendar':
                return 'Calendar';
            case '/overview':
                return 'Overview';
            default:
                return 'Time Tracker';
        }
    }, [activePath]);

    useEffect(() => {
        if (users.loaded && !users.current) setOpenModal(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users.current, users.loaded]);

    return (
        <AppShell
            header={<Header height={{ base: 100, sm: 70 }} title={pageTitle} />}
            footer={<Footer height={70} activePath={activePath} />}
        >
            <UserModal opened={openModal} onClose={() => setOpenModal(false)} />
            {props.children}
        </AppShell>
    );
}
