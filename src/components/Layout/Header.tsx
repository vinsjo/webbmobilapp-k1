import {
    Burger,
    Text,
    Header as MantineHeader,
    MediaQuery,
    Group,
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

                <Text weight="bold">Time Tracker</Text>
            </Group>
        </MantineHeader>
    );
}

export default Header;
