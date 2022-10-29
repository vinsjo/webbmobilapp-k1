import { OmitProps } from '@/utils/type-utils';
import { Header as MantineHeader, Center, Title } from '@mantine/core';

type Props = OmitProps<typeof MantineHeader, 'children'> & {
    title?: string;
};

function Header({ title, ...props }: Props) {
    return (
        <MantineHeader {...props}>
            <Center style={{ width: '100%', height: '100%' }}>
                <Title size="h1">{title || 'Time Tracker'}</Title>
            </Center>
        </MantineHeader>
    );
}

export default Header;
