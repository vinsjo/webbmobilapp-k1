import ModalButton, {
    closeAllModals,
    type ModalButtonProps,
} from '@/components/buttons/ModalButton';
import ProjectForm from '@/components/forms/ProjectForm';
import { Project } from '@/utils/api/types';
import { useProjects } from '@/context/TimeTracker';
import { useCallback } from 'react';

export default function EditProjectModal({
    id,
    ...props
}: Omit<ModalButtonProps, 'modal' | 'onClick' | 'id'> & {
    id: Project['id'];
}) {
    const { setSelected, project } = useProjects(
        useCallback(
            ({ setSelected, data }) => {
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
            modal={{
                title: props.title,
                children: <ProjectForm.Edit onSubmit={closeAllModals} />,
            }}
            onClick={handleClick}
            disabled={!project}
            {...props}
        />
    );
}

EditProjectModal.defaultProps = {
    title: 'Edit Project',
};
