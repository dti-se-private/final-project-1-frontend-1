import {FC, ReactNode, useEffect} from 'react';
import {redirect, usePathname} from 'next/navigation';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/stores';

interface PermissionProviderProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

const pathPatternPermissions = {
    SUPER_ADMIN: [
        '^/$',
        '^/admins.*',
        '^/customers.*',
        '^/products.*',
        '^/browse',
        '^/profile',
        '^/forbidden',
    ],
    WAREHOUSE_ADMIN: [
        '^/$',
        '^/admins/dashboard',
        '^/admins/warehouse-products.*',
        '^/admins/orders.*',
        '^/admins/statistics.*',
        '^/customers.*',
        '^/products.*',
        '^/browse',
        '^/profile',
        '^/forbidden',
    ],
    CUSTOMER: [
        '^/$',
        '^/customers.*',
        '^/products.*',
        '^/browse',
        '^/profile',
        '^/forbidden',
    ],
};

export const PermissionProvider: FC<PermissionProviderProps> = ({children}) => {
    const session = useSelector((state: RootState) => state.authenticationSlice.session);
    const path = usePathname();

    useEffect(() => {
        const requiredPermissions: string[] = [];
        for (const [permission, pathPatterns] of Object.entries(pathPatternPermissions)) {
            for (const pathPattern of pathPatterns) {
                if (new RegExp(pathPattern).test(path)) {
                    requiredPermissions.push(permission);
                    break;
                }
            }
        }

        if (session) {
            if (!requiredPermissions.some(permission => session.permissions.includes(permission))) {
                redirect("/forbidden")
            }
        } else {
            if (requiredPermissions.length > 0) {
                redirect("/login")
            }
        }
    }, [path]);

    return (children);
};
