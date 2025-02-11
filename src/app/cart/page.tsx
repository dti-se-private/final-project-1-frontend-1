"use client"
import {useModal} from "@/src/hooks/useModal";
import React from "react";
import {useParams, useRouter} from "next/navigation";
import {useProduct} from "@/src/hooks/useProduct";
import {useCart} from "@/src/hooks/useCart";
import {Button, Spinner} from "@heroui/react";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {Icon} from "@iconify/react";

export default function Page() {
    const {productId}: { productId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const {
        productState,
        productApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useProduct();

    const {
        cartState,
        cartApiResult,
        setCartItemsRequest,
        addCartItemRequest,
        removeCartItemRequest
    } = useCart();

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    if (cartApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-[78vh] h-full">
            <section
                className="p-8 overflow-y-scroll w-full md:w-2/3 h-full md:relative md:relative md:left-0 md:top-0 md:bottom-0">
                <div className="flex flex-col justify-start items-start mb-8">
                    <div className="text-6xl font-bold">Cart</div>
                    <div>All items in your cart to be checked out.</div>
                </div>
                <div className="flex flex-col gap-8">
                    {cartApiResult.data?.data?.map((cartItem, index) => (
                        <div
                            key={cartItem.id}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full h-[18vh] border-b border-gray-300"
                        >
                            <div className="relative h-full w-[14vw]">
                                <Image
                                    className="rounded-md"
                                    src={
                                        cartItem.product.image
                                            ? convertHexStringToBase64Data(cartItem.product.image, "image/png")
                                            : "https://placehold.co/400x400?text=product"
                                    }
                                    layout="fill"
                                    objectFit="cover"
                                    alt='product'
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="text-lg font-bold">{cartItem.product.name}</div>
                                <div
                                    className="text-md">{currencyFormatter.format(cartItem.product.price * cartItem.quantity)}</div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <Button
                                    isIconOnly
                                    onPress={() => removeCartItemRequest({
                                        productId: cartItem.product.id,
                                        quantity: 1
                                    })}
                                >
                                    <Icon icon="heroicons:minus"/>
                                </Button>
                                <div className="flex justify-center items-center">
                                    {cartItem.quantity}
                                </div>
                                <Button
                                    isIconOnly
                                    onPress={() => addCartItemRequest({
                                        productId: cartItem.product.id,
                                        quantity: 1
                                    })}
                                >
                                    <Icon icon="heroicons:plus"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section
                className="w-full md:w-1/3 h-full md:relative md:right-0 md:top-0 md:bottom-0 border-l border-gray-300">
                <div className="flex w-full h-full flex-col justify-between items-start p-4">
                    <div className="flex flex-col w-full">
                        <div className="mb-8 text-2xl font-bold">Summary</div>
                        <div className="mb-4 flex justify-between w-full">
                            <div>Items Price</div>
                            <div>
                                {currencyFormatter.format(0)}
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <div>Shipment Price</div>
                            <div>
                                {currencyFormatter.format(0)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="mb-4 flex justify-between w-full">
                            <div>Total Price</div>
                            <div>
                                {currencyFormatter.format(0)}
                            </div>
                        </div>
                        <div className="flex justify-between w-full">
                            <Button
                                className="w-full"
                                color="primary"
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}