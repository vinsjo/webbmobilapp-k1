import { useMemo, useCallback } from 'react';
import { useUsers } from '@/context/TimeTracker';
import { Select } from '@mantine/core';

export default function SelectProject({ label }: { label?: React.ReactNode }) {
    const { data, current, setCurrent } = useUsers();

    const selectData = useMemo(() => {
        return data.map(({ id, name }) => ({
            value: `${id}`,
            label: name,
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
            value={!current ? null : `${current.id}`}
            onChange={handleChange}
            dropdownPosition='bottom'
            placeholder={!data.length ? 'No users exist' : 'Select user'}
            data={selectData}
            disabled={!data.length}
            label={label}
            rightSectionProps={
                !data.length ? { style: { display: 'none' } } : {}
            }
        />
    );
}
