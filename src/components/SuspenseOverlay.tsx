import { Suspense } from 'react';
import LoadingOverlay from './LoadingOverlay';

type Props = {
    children: React.ReactNode;
    label?: string;
};

export default function SuspenseOverlay({ children, label }: Props) {
    return (
        <Suspense fallback={<LoadingOverlay label={label} />}>
            {children}
        </Suspense>
    );
}
