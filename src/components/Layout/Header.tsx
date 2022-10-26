import {
    Burger,
    Header as MantineHeader,
    MediaQuery,
    Group,
    Title,
} from '@mantine/core';

type Props = { openBurger: boolean; toggleBurger: () => void };

function Header({ openBurger, toggleBurger }: Props) {
    return (
        <MantineHeader height={70} p="md">
            <Group spacing="md">
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={openBurger}
                        onClick={toggleBurger}
                        size="sm"
                        mr="xl"
                    />
                </MediaQuery>

                <Title size="h1">Time Tracker</Title>
            </Group>
        </MantineHeader>
    );
}

export default Header;
