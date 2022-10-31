import { Text, TextInput, Space, type TextInputProps } from '@mantine/core';
import ColorSwatches from '@/components/input/ColorSwatches';
import type { Project } from '@/utils/api/types';
import Form, { FormProps } from '../Form';

export type ProjectFormProps = Omit<FormProps, 'children'> &
    Pick<Project, 'name' | 'color'> & {
        onNameChange: (name: string) => unknown;
        onColorChange: (color: Project['color']) => unknown;
        error?: TextInputProps['error'];
    };

export default function ProjectForm({
    name,
    color,
    error,
    onColorChange,
    onNameChange,
    ...props
}: ProjectFormProps) {
    return (
        <Form {...props}>
            <TextInput
                size="sm"
                label={
                    <Text size="sm" weight={500}>
                        Project name
                    </Text>
                }
                placeholder="Enter project name"
                value={name}
                error={error}
                minLength={3}
                maxLength={50}
                inputWrapperOrder={['label', 'input', 'error']}
                onChange={({ target }) => onNameChange(target.value)}
                withAsterisk={false}
                autoComplete="off"
                required
            />
            {!error && <Space h="md" />}
            <ColorSwatches
                label={
                    <Text size="sm" weight={500}>
                        Select Color
                    </Text>
                }
                value={color}
                onChange={onColorChange}
            />
        </Form>
    );
}
