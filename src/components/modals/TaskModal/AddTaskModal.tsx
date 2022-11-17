import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import TaskForm from '@/components/forms/TaskForm';

export default function AddTaskModal({
    selectAdded,
    ...props
}: Omit<ModalButtonProps, 'modalContent'> & { selectAdded?: boolean }) {
    return (
        <ModalButton
            modalContent={(onClose) => (
                <TaskForm.Add onSubmit={onClose} selectAdded={selectAdded} />
            )}
            {...props}
        />
    );
}

AddTaskModal.defaultProps = {
    title: 'Add Task',
    selectAdded: true,
};
