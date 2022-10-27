import IconButton, { IconButtonProps } from './IconButton';

import { FaTimes, FaPlus, FaStop, FaPlay } from 'react-icons/fa';

export const AddButton = ({ type = 'submit', ...props }: IconButtonProps) => (
    <IconButton type={type} icon={<FaPlus />} {...props} />
);
export const DeleteButton = (props: IconButtonProps) => (
    <IconButton icon={<FaTimes />} {...props} />
);

export const PlayButton = ({
    active,
    ...props
}: IconButtonProps & { active: boolean }) => (
    <IconButton icon={active ? <FaPlay /> : <FaStop />} {...props} />
);
