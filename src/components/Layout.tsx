import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    AppShell,
    Burger,
    Text,
    Header,
    Navbar,
    NavLink,
    MediaQuery,
} from '@mantine/core';

const links = [
    { to: '/', label: 'Home' },
    { to: '/overview', label: 'Overview' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/timer', label: 'Timer' },
];

export default function Layout(props: React.PropsWithChildren) {
    const { pathname } = useLocation();
    const [opened, setOpened] = useState(false);

    const activePath = useMemo(() => {
        const basePath = pathname.split('/').filter((p) => p)[0] || '';
        return `/${basePath}`;
    }, [pathname]);

    useEffect(() => setOpened(false), [pathname]);

    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            navbar={
                <Navbar
                    width={{ sm: 200, lg: 300 }}
                    height={500}
                    hiddenBreakpoint="sm"
                    p="md"
                    hidden={!opened}
                >
                    {links.map(({ label, to }, i) => (
                        <NavLink
                            key={`nav-link-${i}`}
                            component={Link}
                            label={label}
                            to={to}
                            active={activePath === to}
                            onClick={() => setOpened(false)}
                        />
                    ))}
                </Navbar>
            }
            header={
                <Header height={70} p="md">
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <MediaQuery
                            largerThan="sm"
                            styles={{ display: 'none' }}
                        >
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                mr="xl"
                            />
                        </MediaQuery>

                        <Text weight="bold">Time Tracker</Text>
                    </div>
                </Header>
            }
        >
            {props.children}
        </AppShell>
    );
}
