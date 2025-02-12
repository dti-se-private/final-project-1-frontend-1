"use client"
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useLanding} from "@/src/hooks/useLanding";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {productApi} from "@/src/stores/apis/productApi";
import {Button, Spinner} from "@heroui/react";
import {Icon} from "@iconify/react";

export default function Page() {
    const {productId}: { productId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const {
        landingState,
        productApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useLanding();

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
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-2/3">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                <div className="relative w-full h-[60vh] w-[50vw]">
                    <Image
                        className="rounded-md"
                        src={
                            landingState.details?.image
                                ? convertHexStringToBase64Data(landingState.details?.image, "image/png")
                                : "https://placehold.co/400x400?text=product"
                        }
                        layout="fill"
                        objectFit="cover"
                        alt='product'
                    />
                </div>
                <div className="w-full h-[60vh] flex flex-col justify-start items-start gap-4">
                    <p className="overflow-hidden truncate w-full text-7xl font-bold">{landingState.details?.name}</p>
                    <p className="text-5xl">{currencyFormatter.format(landingState.details?.price ?? 0)}</p>
                    <p className="text-lg">Stock: {landingState.details?.quantity}</p>
                    <p className="text-md">{landingState.details?.description}</p>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-row gap-2">
                            <Button
                                onPress={() => {
                                    if (quantity === 1) {
                                        return;
                                    }
                                    setQuantity(prevState => prevState - 1)
                                }}
                            >
                                {"-"}
                            </Button>
                            <Button>{quantity}</Button>
                            <Button
                                onPress={() => {
                                    if (quantity === landingState.details?.quantity) {
                                        return;
                                    }
                                    setQuantity(prevState => prevState + 1)
                                }}
                            >
                                {"+"}
                            </Button>
                        </div>
                        <Button
                            color="primary"
                            startContent={<Icon icon="heroicons:shopping-cart"/>}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}