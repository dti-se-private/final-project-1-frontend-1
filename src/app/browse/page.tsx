'use client'

import Link from 'next/link';
import {Button, Spinner} from '@heroui/react';
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useProduct} from "@/src/hooks/useProduct";
import {useEffect} from "react";

export default function Page() {
    const {
        productState,
        getProductWithCategoryApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useProduct();

    useEffect(() => {
        setGetProductsRequest({
            size: 10,
            page: 0,
            search: "",
        });
        setGetCategoriesRequest({
            size: 10,
            page: 0,
            search: "",
        });
    }, []);

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <div className="py-8 flex flex-col justify-center items-center">
            {/* Products */}
            <section className="container flex flex-col justify-center items-center px-2">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 min-h-[80vh]">
                    {getProductWithCategoryApiResult.isFetching ?
                        (<Spinner/>) :
                        getProductWithCategoryApiResult.data?.data?.map((product, index) => (
                            <Link
                                href={`/products/${product.id}`}
                                key={index}
                                className="flex flex-col justify-center items-center p-4 border-gray-300 rounded-lg shadow-md md:w-[16vw] h-[50vh] w-[70vw]"
                            >
                                <div className="relative w-[100%] h-[100%] mb-4">
                                    <Image
                                        className="rounded-md"
                                        src={
                                            product.image
                                                ? convertHexStringToBase64Data(product.image, "image/png")
                                                : "https://placehold.co/400x400?text=product"
                                        }
                                        layout="fill"
                                        objectFit="cover"
                                        alt='product'
                                    />
                                </div>
                                <div className="w-full flex flex-col justify-center items-start">
                                    <p className="line-clamp-1 w-full text-lg font-bold">{product.name}</p>
                                    <p className="text-md">{currencyFormatter.format(product.price)}</p>
                                    <p className="text-md">Stock: {product.quantity}</p>
                                </div>
                            </Link>
                        ))
                    }
                    {
                        !getProductWithCategoryApiResult.isFetching
                        && (getProductWithCategoryApiResult.data?.data ?? []).length === 0
                        && (<div className="flex justify-center">Empty!</div>)
                    }
                </div>


                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onPress={() => {
                            if (productState.getProductsRequest.page === 0) {
                                return;
                            }
                            setGetProductsRequest({
                                page: productState.getProductsRequest.page - 1,
                                size: productState.getProductsRequest.size,
                                search: productState.getProductsRequest.search
                            });
                        }}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {productState.getProductsRequest.page + 1}
                    </Button>
                    <Button
                        onPress={() => {
                            setGetProductsRequest({
                                page: productState.getProductsRequest.page + 1,
                                size: productState.getProductsRequest.size,
                                search: productState.getProductsRequest.search
                            });
                        }}
                    >
                        {'>'}
                    </Button>
                </div>
            </section>
        </div>
    );
};

