import { useMemo, useCallback } from 'react';
import { useProjects } from '@/context/TimeTracker';
import { Select } from '@mantine/core';

export default function SelectProject() {
    const { data, selected, setSelected } = useProjects();

    const value = useMemo(
        () => (!selected ? null : `${selected.id}`),
        [selected]
    );

    const selectData = useMemo(() => {
        return data.map(({ id, name }) => ({
            value: `${id}`,
            label: name,
        }));
    }, [data]);

    const handleChange = useCallback(
        (value: string | null) => {
            const id = !value ? null : parseInt(value);
            setSelected(id);
        },
        [setSelected]
    );
    return (
        <>
            <Select
                value={value}
                onChange={handleChange}
                dropdownPosition="bottom"
                label="Selected Project"
                placeholder="No project selected"
                nothingFound={'No matches'}
                data={selectData}
                searchable
                creatable
            />
        </>
    );
}
