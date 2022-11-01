import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import ProjectForm from '@/components/forms/ProjectForm';

export default function AddProjectModal({
    selectAdded,
    ...props
}: Omit<ModalButtonProps, 'modalContent'> & { selectAdded?: boolean }) {
    return (
        <ModalButton
            modalContent={(onClose) => (
                <ProjectForm.Add onSubmit={onClose} selectAdded={selectAdded} />
            )}
            {...props}
        />
    );
}

AddProjectModal.defaultProps = {
    title: 'Add Project',
    selectAdded: true,
};
