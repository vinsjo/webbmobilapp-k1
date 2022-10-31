import ModalButton, {
    closeAllModals,
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import TaskForm from '@/components/forms/TaskForm';
import { Task } from '@/utils/api/types';
import { useTasks } from '@/context/TimeTracker';
import { useCallback } from 'react';

export default function EditTaskModal({
    id,
    ...props
}: Omit<ModalButtonProps, 'modal' | 'onClick' | 'id'> & {
    id: Task['id'];
}) {
    const { setSelected, data } = useTasks();
    const handleClick = useCallback(async () => {
        if (!data.find((task) => task.id === id)) return false;
        await setSelected(id);
        return true;
    }, [data, id, setSelected]);
    return (
        <ModalButton
            modal={{
                title: props.title,
                children: <TaskForm.Add onSubmit={closeAllModals} />,
            }}
            onClick={handleClick}
            {...props}
        />
    );
}

EditTaskModal.defaultProps = {
    title: 'Edit Task',
};
