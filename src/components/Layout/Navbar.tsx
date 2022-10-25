import { Link } from 'react-router-dom';
import { Navbar as MantineNavbar, NavLink } from '@mantine/core';

const links = [
    { to: '/', label: 'Home' },
    { to: '/overview', label: 'Overview' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/timer', label: 'Timer' },
];

type Props = {
    activePath: string;
    hidden: boolean;
    setHidden: (hidden: boolean) => void;
};

export default function Navbar({ activePath, hidden, setHidden }: Props) {
    return (
        <MantineNavbar
            width={{ sm: 200, lg: 300 }}
            height={500}
            hiddenBreakpoint="sm"
            p="md"
            hidden={hidden}
        >
            {links.map(({ label, to }, i) => (
                <NavLink
                    key={`nav-link-${i}`}
                    component={Link}
                    label={label}
                    to={to}
                    active={activePath === to}
                    onClick={() => setHidden(true)}
                />
            ))}
        </MantineNavbar>
    );
}
