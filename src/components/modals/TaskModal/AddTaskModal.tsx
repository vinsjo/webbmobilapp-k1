import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import TaskForm from '@/components/forms/TaskForm';
export default function AddTaskModal(
    props: Omit<ModalButtonProps, 'modalContent'>
) {
    return (
        <ModalButton
            modalContent={(onClose) => <TaskForm.Add onSubmit={onClose} />}
            {...props}
        />
    );
}

AddTaskModal.defaultProps = {
    title: 'Add Task',
};
