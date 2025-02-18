"use client"
import { HeroUIProvider } from '@heroui/react';
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/src/stores";
import { PersistGate } from "redux-persist/integration/react";
import 'swiper/scss';
import 'swiper/scss/pagination';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PermissionProvider } from '@/src/components/PermissionProvider';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const pathPermissions = {
    SUPER_ADMIN: [
        '/admins/warehouse-admins/*',
        '/admins/warehouses/*',
        '/admins/products/*',
        '/admins/categories/*',
        '/admins/warehouse-products/*'
    ],
    SUPER_ADMIN_OR_WAREHOUSE_ADMIN: [
        '/admins/statistics/*',
        '/orders/*',
    ],
    CUSTOMER: [
        '/customers/*'
    ],
};

export default function RootProvider({ children }: { children: React.ReactNode }) {
    const path = usePathname();
    const [requiredPermissions, setRequiredPermissions] = useState<string[]>([]);

    useEffect(() => {
        const permissions: string[] = [];

        for (const [key, paths] of Object.entries(pathPermissions)) {
            if (paths.some(p => p === path || (p.endsWith('/*') && path.startsWith(p.slice(0, -1))))) {
                if (key === 'SUPER_ADMIN_OR_WAREHOUSE_ADMIN') {
                    permissions.push('SUPER_ADMIN', 'WAREHOUSE_ADMIN');
                } else {
                    permissions.push(key);
                }
            }
        }

        if (permissions.length === 0) {
            permissions.push('DEFAULT');
        }

        setRequiredPermissions(permissions);
    }, [path]);

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HeroUIProvider>
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                        <PermissionProvider requiredPermissions={requiredPermissions}>
                            {children}
                        </PermissionProvider>
                    </GoogleOAuthProvider>
                </HeroUIProvider>
            </PersistGate>
        </ReduxProvider>
    );
}