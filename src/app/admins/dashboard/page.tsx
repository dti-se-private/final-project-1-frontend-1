'use client'

import Link from 'next/link';
import React, {useEffect, useState} from "react";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {useRouter} from "next/navigation";


export default function Page() {
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
            {text: "Order Management", link: "/admins/orders"},
            {text: "Payment Confirmation Order Management", link: "/admins/orders/payment-confirmations"},
            {text: "Stock Mutation Management", link: "/admins/stock-mutations"},
            {text: "Product Sales Statistics", link: "/admins/statistics/product-sales"},
            {text: "Product Stocks Statistics", link: "/admins/statistics/product-stocks"},
        ],
        WAREHOUSE_ADMIN: [
            {text: "Warehouse Management", link: "/admins/warehouses"},
            {text: "Warehouse Product Management", link: "/admins/warehouse-products"},
            {text: "Order Management", link: "/admins/orders"},
            {text: "Payment Confirmation Order Management", link: "/admins/orders/payment-confirmations"},
            {text: "Product Sales Statistics", link: "/admins/statistics/product-sales"},
            {text: "Product Stock Statistics", link: "/admins/statistics/product-stocks"},
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
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="text-center mb-8 text-4xl font-bold">Dashboard</h1>
                <div className="flex justify-center items-center flex-wrap gap-8 p-4">
                    {buttonsToShow.map((item, index) => (
                        <Link
                            className="md:w-1/4 w-full h-[20vh] p-4 flex flex-col text-center text-white text-lg font-bold justify-center items-center rounded-lg shadow-md bg-blue-500 hover:bg-blue-700"
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