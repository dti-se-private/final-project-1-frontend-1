import { useEffect, createContext, useContext, ReactNode, FC } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/stores';

interface PermissionProviderProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

const PermissionContext = createContext<{ hasPermission: boolean }>({ hasPermission: true });

const checkPermissions = (userPermissions: string[], requiredPermissions: string[]) => {
    return requiredPermissions.length === 0 || requiredPermissions.some(permission => userPermissions.includes(permission) || permission === 'DEFAULT');
};

const PermissionProvider: FC<PermissionProviderProps> = ({ children, requiredPermissions = [] }) => {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.authenticationSlice.session);

    useEffect(() => {
        if (!session) {
            if (requiredPermissions.length > 0 && !requiredPermissions.includes('DEFAULT')) {
                router.push('/login');
            }
        } else {
            const userPermissions = session.permissions ?? [];
            if (!checkPermissions(userPermissions, requiredPermissions)) {
                router.push('/forbidden');
            }
        }
    }, [session, requiredPermissions, router]);

    const hasPermission = session ? checkPermissions(session.permissions ?? [], requiredPermissions) : requiredPermissions.includes('DEFAULT');

    return (
        <PermissionContext.Provider value={{ hasPermission }}>
            {hasPermission ? children : <div>Loading...</div>}
        </PermissionContext.Provider>
    );
};

export { PermissionProvider, PermissionContext };