import { useMemo, useCallback, forwardRef } from 'react';
import { useUsers } from '@/context/TimeTrackerContext';
import {
    Group,
    Text,
    Select,
    SelectItem as MantineSelectItem,
    useMantineTheme,
    MantineSize,
    DefaultMantineColor,
} from '@mantine/core';
import Avatar from 'boring-avatars';

function UserAvatar({ name, size }: { name: string; size?: MantineSize }) {
    const theme = useMantineTheme();
    const colors = useMemo(() => {
        const keys: DefaultMantineColor[] = [
            'yellow',
            'blue',
            'lime',
            'violet',
            'red',
        ];
        return keys.map((key) => theme.colors[key][7]);
    }, [theme]);
    return (
        <Avatar
            size={theme.fontSizes[size || 'md']}
            name={name}
            variant='beam'
            colors={colors}
        />
    );
}

interface SelectItemProps extends MantineSelectItem {
    name: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ value, name, ...divProps }, ref) => {
        return (
            <div ref={ref} {...divProps}>
                <Group noWrap>
                    <UserAvatar name={name} />
                    <Text size='md'>{name}</Text>
                </Group>
            </div>
        );
    }
);

export default function SelectUser({
    label,
    size,
}: {
    label?: React.ReactNode;
    size?: MantineSize;
}) {
    const { data, selected: current, setSelected: setCurrent } = useUsers();

    const selectData: SelectItemProps[] = useMemo(() => {
        return data.map(({ id, name }) => ({
            value: `${id}`,
            label: name,
            name,
        }));
    }, [data]);

    const handleChange = useCallback(
        (value: string | null) => {
            const id = !value ? null : parseInt(value);
            setCurrent(id || null);
        },
        [setCurrent]
    );

    return (
        <Select
            size={size}
            value={!current ? null : `${current.id}`}
            onChange={handleChange}
            dropdownPosition='bottom'
            placeholder={!data.length ? 'No users exist' : 'Select user'}
            data={selectData}
            itemComponent={SelectItem}
            icon={
                !current ? null : <UserAvatar name={current.name} size={size} />
            }
            disabled={!data.length}
            label={label}
            rightSectionProps={
                !data.length ? { style: { display: 'none' } } : {}
            }
        />
    );
}
