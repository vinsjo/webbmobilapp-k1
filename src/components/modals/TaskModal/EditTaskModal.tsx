import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import TaskForm from '@/components/forms/TaskForm';
import { Task } from '@/utils/api/types';
import { useTasks } from '@/context/TimeTracker';
import { useCallback } from 'react';

export default function EditTaskModal({
    id,
    disabled,
    ...props
}: Omit<ModalButtonProps, 'modalContent' | 'onClick' | 'id'> & {
    id: Task['id'];
}) {
    const { setSelected, task } = useTasks(
        useCallback(
            ({ setSelected, data }) => {
                return {
                    task: data.find((task) => task.id === id),
                    setSelected,
                };
            },
            [id]
        )
    );
    const handleClick = useCallback(async () => {
        if (!task) return false;
        await setSelected(id);
        return true;
    }, [task, id, setSelected]);
    return (
        <ModalButton
            modalContent={(onClose) => <TaskForm.Edit onSubmit={onClose} />}
            onClick={handleClick}
            disabled={!task || disabled}
            {...props}
        />
    );
}

EditTaskModal.defaultProps = {
    title: 'Edit Task',
};
