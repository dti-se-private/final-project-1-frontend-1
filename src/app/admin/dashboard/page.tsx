"use client"

import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useAuthentication } from "@/src/hooks/useAuthentication";

const permissions = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    WAREHOUSE_ADMIN: 'WAREHOUSE_ADMIN',
};

const buttonList = {
    SUPER_ADMIN: [
        { text: "Warehouse Management", link: "/admin/warehouses" },
        { text: "Warehouse Admin Management", link: "/admin/warehouse-admins" },
        { text: "Product Management", link: "/admin/products" },
        { text: "Category Management", link: "/admin/categories" },
        { text: "Warehouse Product Management", link: "/admin/warehouse-products" },
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

    useEffect(() => {
        if (authentication.state.session?.permissions) {
            setAccountPermissions(authentication.state.session.permissions);
        }
    }, [authentication.state.session]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
                    {buttonsToShow.map((button, index) => (
                        <Link key={index} href={button.link}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center space-x-2">
                            <span>{button.text}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}