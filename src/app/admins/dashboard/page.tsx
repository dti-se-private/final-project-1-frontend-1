"use client"

import Link from 'next/link';
import React, {useEffect, useState} from "react";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {useRouter} from "next/navigation";


export default function Dashboard() {
    const router = useRouter();
    const authentication = useAuthentication();
    const [accountPermissions, setAccountPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (authentication.state.session?.permissions) {
            setAccountPermissions(authentication.state.session.permissions);
        }
    }, [authentication.state.session]);

    const buttonsToShow = [];

    const permissions = {
        SUPER_ADMIN: 'SUPER_ADMIN',
        WAREHOUSE_ADMIN: 'WAREHOUSE_ADMIN',
    };

    const buttonList = {
        SUPER_ADMIN: [
            {text: "Warehouse Management", link: "/admins/warehouses"},
            {text: "Warehouse Admin Management", link: "/admins/warehouse-admins"},
            {text: "Product Management", link: "/admins/products"},
            {text: "Category Management", link: "/admins/categories"},
            {text: "Warehouse Product Management", link: "/admins/warehouse-products"},
        ],
        WAREHOUSE_ADMIN: [
            {text: "Warehouse Management", link: "/admins/warehouses"},
        ],
    };

    const hasPermission = (accountPermissions: string[], requiredPermissions: string[]) => {
        return requiredPermissions.some(permission => accountPermissions.includes(permission));
    };

    if (hasPermission(accountPermissions, [permissions.SUPER_ADMIN])) {
        buttonsToShow.push(...buttonList.SUPER_ADMIN);
    } else if (hasPermission(accountPermissions, [permissions.WAREHOUSE_ADMIN])) {
        buttonsToShow.push(...buttonList.WAREHOUSE_ADMIN);
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
                <div className="flex justify-center items-center flex-wrap gap-8 p-4">
                    {buttonsToShow.map((item, index) => (
                        <Link
                            className="md:w-1/4 w-full h-[20vh] p-4 flex flex-col text-center text-white text-xl font-bold justify-center items-center rounded-lg shadow-md bg-blue-500 hover:bg-blue-700"
                            key={index}
                            href={item.link}
                        >
                            {item.text}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    );
}