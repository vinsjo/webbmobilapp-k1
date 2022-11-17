import { Footer as MantineFooter, ActionIcon, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaStopwatch, FaListAlt } from 'react-icons/fa';

const links = [
    { to: '/calendar', title: 'Calendar', icon: FaCalendarAlt },
    { to: '/', title: 'Timer', icon: FaStopwatch },
    { to: '/overview', title: 'Overview', icon: FaListAlt },
];

type Props = Omit<Parameters<typeof MantineFooter>[0], 'children' | 'fixed'> & {
    activePath: string;
};
export default function Footer({ activePath, ...props }: Props) {
    return (
        <MantineFooter fixed {...props}>
            <Group
                spacing='sm'
                position='apart'
                p='sm'
                grow
                sx={{ width: '100%', height: '100%' }}
            >
                {links.map(({ to, title, icon: Icon }, i) => {
                    const active = activePath === to;
                    return (
                        <ActionIcon
                            key={`footer-link-${i}`}
                            component={Link}
                            to={to}
                            title={title}
                            p='md'
                            size='xl'
                            variant={active ? 'filled' : 'subtle'}
                            sx={(theme) => ({
                                color: theme.colors.gray[active ? 0 : 6],
                                height: '100%',
                            })}
                        >
                            <Icon
                                style={{
                                    width: 50,
                                    height: 50,
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                }}
                            />
                        </ActionIcon>
                    );
                })}
            </Group>
        </MantineFooter>
    );
}
