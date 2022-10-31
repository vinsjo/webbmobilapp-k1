import ModalButton, {
    closeAllModals,
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import ProjectForm from '@/components/forms/ProjectForm';

export default function AddProjectModal(
    props: Omit<ModalButtonProps, 'modal'>
) {
    return (
        <ModalButton
            modal={{
                title: props.title,
                children: <ProjectForm.Add onSubmit={closeAllModals} />,
            }}
            {...props}
        />
    );
}

AddProjectModal.defaultProps = {
    title: 'Add Project',
};
