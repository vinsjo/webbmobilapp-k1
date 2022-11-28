import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import Footer from './Footer';
import Header from './Header';
import UserModal from '../modals/UserModal';
import { useUsers } from '@/context/TimeTrackerContext';

export default function Layout(props: React.PropsWithChildren) {
    const { loaded, current: currentUser } = useUsers();
    const [openUserModal, setOpenUserModal] = useState(!currentUser);
    const { pathname } = useLocation();
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
        if (loaded && !currentUser) setOpenUserModal(true);
    }, [loaded, currentUser]);

    return (
        <AppShell
            header={<Header height={{ base: 100, sm: 70 }} title={pageTitle} />}
            footer={<Footer height={70} activePath={activePath} />}
        >
            <UserModal
                opened={openUserModal}
                onClose={() => setOpenUserModal(false)}
            />
            {props.children}
        </AppShell>
    );
}
