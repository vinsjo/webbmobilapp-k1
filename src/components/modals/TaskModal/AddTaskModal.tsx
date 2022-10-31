import ModalButton, {
    closeAllModals,
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import TaskForm from '@/components/forms/TaskForm';

export default function AddTaskModal(props: Omit<ModalButtonProps, 'modal'>) {
    return (
        <ModalButton
            modal={{
                title: props.title,
                children: (
                    <>
                        <TaskForm.Add onSubmit={closeAllModals} />
                    </>
                ),
            }}
            {...props}
        />
    );
}

AddTaskModal.defaultProps = {
    title: 'Add Task',
};
