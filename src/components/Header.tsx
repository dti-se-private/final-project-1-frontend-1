'use client'

import Link from 'next/link';
import {
    Avatar,
    Badge,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Input,
    Navbar,
    NavbarBrand,
    NavbarContent
} from "@heroui/react";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {redirect, useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import {useModal} from "@/src/hooks/useModal";
import _ from "lodash";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useProduct} from "@/src/hooks/useProduct";
import {Icon} from "@iconify/react";
import React from "react";
import {useCart} from "@/src/hooks/useCart";

export default function Component() {
    const modal = useModal();
    const authentication = useAuthentication();
    const router = useRouter();

    const {
        cartState,
        getCartApiResult,
        setCartItemsRequest,
    } = useCart();

    const {
        productState,
        getProductWithCategoryApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useProduct();

    const handleLogout = () => {
        authentication
            .logout()
            .then((data) => {
                modal.setContent({
                    header: "Logout Succeed",
                    body: `${data?.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Logout Failed",
                    body: `${error.message}`,
                })
            })
            .finally(() => {
                modal.onOpenChange(true);
                redirect("/login");
            });
    }

    const handleSearch = _.debounce((event) => {
        setGetProductsRequest({
            page: 0,
            size: productState.getProductsRequest.size,
            search: event.target.value
        });
    }, 500)

    const hasPermission = (requiredPermissions: string[]) => {
        return requiredPermissions.some(permission => authentication.state.session?.permissions.includes(permission));
    };

    return (
        <Navbar isBordered>
            <NavbarBrand className="w-1/6">
                <Link className="text-xl font-bold truncate" href="/">Ecommerce</Link>
            </NavbarBrand>
            <NavbarContent as="div" className="w-3/6 items-center" justify="center">
                <Input
                    type="text"
                    placeholder="Type to search..."
                    startContent={<SearchIcon className="text-gray-500"/>}
                    onChange={(event) => {
                        if (window.location.pathname !== "/browse") {
                            router.push("/browse");
                        }
                        handleSearch(event);
                    }}
                />
            </NavbarContent>
            <NavbarContent as="div" className="w-2/6 items-center gap-8" justify="end">
                <Link href="/customers/cart" className="flex justify-center items-center">
                    <Badge
                        color="danger"
                        content={getCartApiResult.data?.data?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}
                    >
                        <Icon icon="heroicons:shopping-cart" className="text-2xl"/>
                    </Badge>
                </Link>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            size="sm"
                            src={
                                authentication.state.account?.image
                                    ? convertHexStringToBase64Data(authentication.state.account?.image, "image/png")
                                    : "https://placehold.co/400x400?text=A"
                            }
                        />
                    </DropdownTrigger>
                    <DropdownMenu>
                        {authentication.state.isLoggedIn ?
                            (
                                <>
                                    <DropdownItem key="user-info" className="gap-2">
                                        <p className="font-semibold">{authentication.state.account?.name}</p>
                                        <p className="font-semibold">{authentication.state.account?.email}</p>
                                    </DropdownItem>
                                    <DropdownSection showDivider title="Menu">
                                        {hasPermission(['SUPER_ADMIN', 'WAREHOUSE_ADMIN']) ? (
                                            <DropdownItem key="dashboard" href="/admins/dashboard">
                                                Dashboard
                                            </DropdownItem>
                                        ) : null}
                                        <DropdownItem key="addresses" href="/customers/addresses">
                                            Addresses
                                        </DropdownItem>
                                        <DropdownItem key="orders" href="/customers/orders">
                                            Orders
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Account">
                                        <DropdownItem key="profile" href="/profile">
                                            Profile
                                        </DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            color="danger"
                                            onPress={() => handleLogout()}
                                        >
                                            Logout
                                        </DropdownItem>
                                    </DropdownSection>
                                </>
                            )
                            :
                            (
                                <>
                                    <DropdownItem
                                        key="login"
                                        href="/login"
                                    >
                                        Login
                                    </DropdownItem>
                                    <DropdownItem
                                        key="register"
                                        href="/register"
                                    >
                                        Register
                                    </DropdownItem>
                                </>
                            )}
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
};
