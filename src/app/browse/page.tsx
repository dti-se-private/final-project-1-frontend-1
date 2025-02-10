"use client"
import {Button, Spinner} from '@heroui/react';
import Link from "next/link";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useLanding} from "@/src/hooks/useLanding";

export default function Page() {
    const {
        landingState,
        productApiResult,
        categoryApiResult,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails,
        setCategory
    } = useLanding();

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
                    {productApiResult.data?.data?.map((product, index) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={index}
                            className="flex flex-col justify-center items-center p-4 border-gray-300 rounded-lg shadow-md h-full"
                        >
                            <div className="relative w-full md:h-[30vh] md:w-[30vh] h-[40vh] w-[40vh] mb-4">
                                <Image
                                    className="rounded-md"
                                    src={
                                        product.image
                                            ? convertHexStringToBase64Data(product.image, "image/png")
                                            : "https://placehold.co/1366x768?text=product"
                                    }
                                    layout="fill"
                                    objectFit="cover"
                                    alt='product'
                                />
                            </div>
                            <div className="w-full flex flex-col justify-center items-start">
                                <h3 className="overflow-hidden truncate w-full text-lg font-bold">{product.name}</h3>
                                <p className="text-md">{currencyFormatter.format(product.price)}</p>
                                <p className="text-md">Stock: {product.quantity}</p>
                            </div>
                        </Link>
                    ))}
                    {productApiResult.isLoading && (<Spinner/>)}
                    {!productApiResult.isLoading && productApiResult.data?.data?.length === 0 && (
                        <div className="flex justify-center">
                            Empty!
                        </div>
                    )}
                </div>


                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onPress={() => {
                            if (landingState.getProductsRequest.page === 0) {
                                return;
                            }
                            setGetProductsRequest({
                                page: landingState.getProductsRequest.page - 1,
                                size: landingState.getProductsRequest.size,
                                search: landingState.getProductsRequest.search
                            });
                        }}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {landingState.getProductsRequest.page + 1}
                    </Button>
                    <Button
                        onPress={() => {
                            setGetProductsRequest({
                                page: landingState.getProductsRequest.page + 1,
                                size: landingState.getProductsRequest.size,
                                search: landingState.getProductsRequest.search
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

