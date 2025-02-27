"use client"
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useProduct} from "@/src/hooks/useProduct";
import {useCart} from "@/src/hooks/useCart";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {productApi} from "@/src/stores/apis/productApi";
import {Button, Spinner} from "@heroui/react";
import {Icon} from "@iconify/react";
import {upperFirst} from "tiny-case";

export default function Page() {
    const {productId}: { productId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const {
        productState,
        getProductWithCategoryApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useProduct();

    const {
        cartState,
        getCartApiResult,
        setCartItemsRequest,
        addCartItemRequest,
        removeCartItemRequest
    } = useCart();

    const detailProductApiResult = productApi.useGetProductQuery({
        id: productId,
    });

    useEffect(() => {
        if (detailProductApiResult.data?.data) {
            setDetails(detailProductApiResult.data.data);
        }
    }, [detailProductApiResult.data?.data]);

    const [quantity, setQuantity] = useState(1);

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    if (detailProductApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div
                className="container flex md:flex-row md:justify-center md:items-start flex-col justify-center item-center gap-8 w-3/4">
                <div className="relative md:h-[65vh] md:w-[55vw] h-[45vh] w-[100%]">
                    <Image
                        className="rounded-md"
                        src={
                            productState.details?.image
                                ? convertHexStringToBase64Data(productState.details?.image, "image/png")
                                : "https://placehold.co/400x400?text=product"
                        }
                        layout="fill"
                        objectFit="cover"
                        alt='product'
                    />
                </div>
                <div className="w-full min-h-[60vh] flex flex-col justify-start items-start gap-2 text-justify">
                    <p className="text-6xl font-bold">{productState.details?.name}</p>
                    <p className="text-3xl">{currencyFormatter.format(productState.details?.price ?? 0)}</p>
                    <p className="text-lg">Stock: {productState.details?.quantity ? productState.details?.quantity - quantity : 0}</p>
                    <p className="text-lg">Category: {upperFirst(productState.details?.category?.name ?? "-")}</p>
                    <p className="text-md">{productState.details?.description}</p>
                    <div className="flex md:flex-row flex-col md:justify-start gap-2 mt-2 w-full">
                        <div className="flex flex-row gap-2">
                            <Button
                                isIconOnly
                                onPress={() => {
                                    if (quantity === 1) {
                                        return;
                                    }
                                    setQuantity(prevState => prevState - 1)
                                }}
                            >
                                <Icon icon="heroicons:minus"/>
                            </Button>
                            <Button
                                variant="bordered"
                            >
                                {quantity}
                            </Button>
                            <Button
                                isIconOnly
                                onPress={() => {
                                    if (quantity === productState.details?.quantity) {
                                        return;
                                    }
                                    setQuantity(prevState => prevState + 1)
                                }}
                            >
                                <Icon icon="heroicons:plus"/>
                            </Button>
                        </div>
                        <Button
                            className="w-full"
                            color="primary"
                            startContent={<Icon icon="heroicons:shopping-cart"/>}
                            onPress={() => addCartItemRequest({
                                productId: productState.details!.id,
                                quantity: quantity
                            })
                                .then((data) => {
                                    modal.setContent({
                                        header: "Add to Cart Succeed",
                                        body: `${data.message}`,
                                    })
                                })
                                .catch((error) => {
                                    modal.setContent({
                                        header: "Add to Cart Failed",
                                        body: `${error.data.message}`,
                                    })
                                }).finally(() => {
                                    modal.onOpenChange(true);
                                })
                            }
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}