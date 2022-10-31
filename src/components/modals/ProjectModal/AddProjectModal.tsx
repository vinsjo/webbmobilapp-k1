import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import ProjectForm from '@/components/forms/ProjectForm';

export default function AddProjectModal(
    props: Omit<ModalButtonProps, 'modalContent'>
) {
    return (
        <ModalButton
            modalContent={(onClose) => <ProjectForm.Add onSubmit={onClose} />}
            {...props}
        />
    );
}

AddProjectModal.defaultProps = {
    title: 'Add Project',
};
