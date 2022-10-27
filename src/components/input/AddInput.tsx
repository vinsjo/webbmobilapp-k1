import { TextInput, type TextInputProps } from '@mantine/core';
import { AddButton } from '../buttons';

type Props = Omit<TextInputProps, 'rightSection'> & {
    disabled?: boolean;
};

export default function AddInput({ disabled, ...props }: Props) {
    return (
        <TextInput
            size="sm"
            inputWrapperOrder={['label', 'input', 'error']}
            rightSection={<AddButton type="submit" disabled={disabled} />}
            {...props}
        />
    );
}
