import { Text, TextInput, Space, type TextInputProps } from '@mantine/core';
import Form, { FormProps } from '../Form';

export type TaskFormProps = Omit<FormProps, 'children'> & {
    input: string;
    onChange: (input: string) => unknown;
    error?: TextInputProps['error'];
};

export default function TaskForm({
    input,
    onChange,
    error,
    ...props
}: TaskFormProps) {
    return (
        <Form {...props}>
            <TextInput
                size="sm"
                label={
                    <Text size="sm" weight={500}>
                        Task title
                    </Text>
                }
                placeholder="Enter task title"
                value={input}
                error={error}
                minLength={2}
                maxLength={50}
                inputWrapperOrder={['label', 'input', 'error']}
                onChange={({ target }) => onChange(target.value)}
                withAsterisk={false}
                autoComplete="off"
                autoFocus
                required
            />
            {!error && <Space h="md" />}
        </Form>
    );
}
