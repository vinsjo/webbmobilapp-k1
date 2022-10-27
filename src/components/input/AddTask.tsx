import React, { useCallback, useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import { useTasks } from '@/context/TimeTracker';
import { Project } from '@/utils/api/types';
import { filterData } from '@/utils';
import { OmitProps } from '@/utils/types';
import AddInput from './AddInput';

type Props = OmitProps<typeof AddInput, 'value' | 'onChange' | 'error'> & {
    projectId: Project['id'];
};

export default function AddTask({ projectId, ...props }: Props) {
    const { data, add, error } = useTasks(
        useCallback(
            ({ data, add, error }) => {
                return {
                    data: !projectId
                        ? []
                        : filterData(data, 'projectId', projectId),
                    add,
                    error,
                };
            },
            [projectId]
        )
    );
    const [input, setInput] = useState('');
    const trimmed = useMemo(() => input.trim(), [input]);

    const titleExists = useMemo(() => {
        return !!data.find(({ title }) =>
            new RegExp(`^${title}$`, 'gi').test(trimmed)
        );
    }, [trimmed, data]);

    const errorOutput = useMemo(() => {
        if (error && typeof error === 'string') return error;
        if (titleExists) {
            return 'A task with that title already exists in current project';
        }
        return null;
    }, [error, titleExists]);

    const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (ev) => {
            ev.preventDefault();
            if (!projectId || titleExists) return;
            if (!trimmed.length) return setInput('');
            const added = await add({ title: trimmed, projectId });
            if (!added) return;
            setInput('');
        },
        [trimmed, titleExists, add, projectId]
    );
    return (
        <Box component="form" onSubmit={handleSubmit}>
            <AddInput
                value={input}
                onChange={({ target }) => setInput(target.value)}
                label="Add Task"
                placeholder="Enter task title"
                error={errorOutput}
                minLength={3}
                maxLength={50}
                disabled={!projectId || !input || titleExists}
                {...props}
            />
        </Box>
    );
}
