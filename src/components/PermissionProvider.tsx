import React, { useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/stores';

interface PermissionProviderProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

const PermissionContext = createContext<{ hasPermission: boolean }>({ hasPermission: true });

const PermissionProvider: React.FC<PermissionProviderProps> = ({ children, requiredPermissions = [] }) => {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.authenticationSlice.session);

    useEffect(() => {
        if (!session) {
            if (requiredPermissions.length > 0) {
                router.push('/login');
            }
        } else {
            const userPermissions = session.permissions || [];
            const hasPermission = requiredPermissions.length === 0 || requiredPermissions.some(permission => userPermissions.includes(permission));
            if (!hasPermission) {
                router.push('/forbidden');
            }
        }
    }, [session, requiredPermissions, router]);

    const hasPermission = session ? requiredPermissions.length === 0 || requiredPermissions.some(permission => session.permissions.includes(permission)) : requiredPermissions.length === 0;

    return (
        <PermissionContext.Provider value={{ hasPermission }}>
            {hasPermission ? children : <div>Loading...</div>}
        </PermissionContext.Provider>
    );
};

export { PermissionProvider, PermissionContext };