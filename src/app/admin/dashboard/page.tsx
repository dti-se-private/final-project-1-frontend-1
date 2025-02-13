"use client"

import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useAuthentication } from "@/src/hooks/useAuthentication";
import { useGetPermissionsQuery } from "@/src/stores/apis/accountPermissionApi";

const permissions = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    WAREHOUSE_ADMIN: 'WAREHOUSE_ADMIN',
};

const buttonList = {
    SUPER_ADMIN: [
        { text: "Warehouse Management", link: "/admin/warehouses" },
        { text: "Warehouse Admin Management", link: "/admin/warehouse-admins" },
        { text: "Customer Order Management", link: "/orders" },
    ],
    WAREHOUSE_ADMIN: [
        { text: "Warehouse Management", link: "/admin/warehouses" },
    ],
};

const hasPermission = (accountPermissions: string[], requiredPermissions: string[]) => {
    return requiredPermissions.some(permission => accountPermissions.includes(permission));
};

export default function Dashboard() {
    const authentication = useAuthentication();
    const [accountPermissions, setAccountPermissions] = useState<string[]>([]);
    const { data, error } = useGetPermissionsQuery({ id: authentication.state.account?.id ?? "" });

    useEffect(() => {
        if (data && data.data) {
            setAccountPermissions(data.data.permissions);
        }
    }, [data]);

    const buttonsToShow = [];

    if (hasPermission(accountPermissions, [permissions.SUPER_ADMIN])) {
        buttonsToShow.push(...buttonList.SUPER_ADMIN);
    } else if (hasPermission(accountPermissions, [permissions.WAREHOUSE_ADMIN])) {
        buttonsToShow.push(...buttonList.WAREHOUSE_ADMIN);
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
                {error ? (
                    <div className="text-red-500">Failed to load permissions: Error Loading Permission</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
                        {buttonsToShow.map((button, index) => (
                            <Link key={index} href={button.link}
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                                <span>{button.text}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}