import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function usePathChange(
    callback: (prev: string, current: string) => unknown
) {
    const { pathname } = useLocation();
    const prevPath = useRef(pathname);
    useEffect(() => {
        if (pathname === prevPath.current) return;
        if (typeof callback === 'function') {
            callback(prevPath.current, pathname);
        }
        prevPath.current = pathname;
    }, [pathname, callback]);
}
