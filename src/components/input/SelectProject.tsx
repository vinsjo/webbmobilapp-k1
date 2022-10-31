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
        return data.map(({ id, name, color }) => ({
            value: `${id}`,
            label: name,
            color,
        }));
    }, [data]);

    const disabled = useMemo(() => !data.length, [data]);

    const handleChange = useCallback(
        (value: string | null) => {
            const id = !value ? null : parseInt(value);
            setSelected(id);
        },
        [setSelected]
    );
    return (
        <Select
            value={value}
            onChange={handleChange}
            dropdownPosition="bottom"
            placeholder={
                !data.length ? 'No projects created yet' : 'Select a project'
            }
            nothingFound="No matches"
            data={selectData}
            disabled={disabled}
            rightSectionProps={disabled ? { style: { display: 'none' } } : {}}
            searchable
            creatable
        />
    );
}
