import ModalButton, {
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import ProjectForm from '@/components/forms/ProjectForm';
import { useProjects } from '@/context/TimeTrackerContext';
import { useCallback } from 'react';

export default function EditProjectModal({
    id,
    disabled,
    ...props
}: Omit<ModalButtonProps, 'modalContent' | 'onClick' | 'id'> & {
    id: Project['id'];
}) {
    const { setSelected, project } = useProjects(
        useCallback(
            ({ setSelected: setSelected, data }) => {
                return {
                    setSelected,
                    project: data.find((p) => p.id === id),
                };
            },
            [id]
        )
    );
    const handleClick = useCallback(async () => {
        if (!project) return false;
        await setSelected(id);
    }, [id, setSelected, project]);

    return (
        <ModalButton
            modalContent={(onClose) => <ProjectForm.Edit onSubmit={onClose} />}
            onClick={handleClick}
            disabled={!project || disabled}
            {...props}
        />
    );
}

EditProjectModal.defaultProps = {
    title: 'Edit Project',
};
