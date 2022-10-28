import { OmitProps } from '@/utils/type-utils';
import { Header as MantineHeader, Group, Title } from '@mantine/core';

type Props = OmitProps<typeof MantineHeader, 'children'> & {
    title?: string;
};

function Header({ title, ...props }: Props) {
    return (
        <MantineHeader p="md" {...props}>
            <Group spacing="md">
                <Title size="h1">{title || 'Time Tracker'}</Title>
            </Group>
        </MantineHeader>
    );
}

export default Header;
