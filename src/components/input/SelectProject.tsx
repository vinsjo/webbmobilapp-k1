import { useMemo, useCallback } from 'react';
import { useProjects } from '@/context/TimeTrackerContext';
import { Select } from '@mantine/core';

export default function SelectProject({ label }: { label?: React.ReactNode }) {
    const { data, current, setCurrent } = useProjects();

    const selectData = useMemo(() => {
        return data.map(({ id, name, color }) => ({
            value: `${id}`,
            label: name,
            color,
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
            placeholder={
                !data.length ? 'No projects created yet' : 'Select a project'
            }
            nothingFound='No matches'
            data={selectData}
            disabled={!data.length}
            label={label}
            rightSectionProps={
                !data.length ? { style: { display: 'none' } } : {}
            }
            searchable
            creatable
        />
    );
}
