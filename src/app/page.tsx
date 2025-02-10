"use client"
import {Button, Spinner} from '@heroui/react';
import Image from 'next/image';
import {useLanding} from '@/src/hooks/useLanding';
import {upperFirst} from "tiny-case";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Page() {
    const router = useRouter();
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

    const categories = [
        {id: "", name: "all", description: "all"},
        ...categoryApiResult.data?.data?.slice(0, 10) ?? []
    ]

    return (
        <div className="pb-8 flex flex-col justify-center items-center">
            {/* Hero */}
            <section className="w-full mb-8">
                <Swiper
                    loop={true}
                    autoplay={true}
                    modules={[Pagination]}
                    spaceBetween={15}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    pagination={{clickable: true}}
                >
                    {
                        [1, 2, 3, 4].map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="w-full h-[90vh] relative mb-12">
                                    <Image
                                        className="rounded-md"
                                        src={`https://placehold.co/1366x768?text=hero${index}`}
                                        layout="fill"
                                        objectFit="cover"
                                        alt="hero"
                                    />
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </section>

            {/* Categories */}
            <section className="container flex flex-col justify-center items-center mb-8 px-2">
                <div className="flex flex-wrap justify-center items-center gap-4">
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            onPress={() => setCategory(category)}
                            variant={landingState.category?.id === category.id ? 'solid' : 'bordered'}
                        >
                            {upperFirst(category.name)}
                        </Button>
                    ))}
                </div>
            </section>

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
                                            : "https://placehold.co/400x400?text=product"
                                    }
                                    layout="fill"
                                    objectFit="cover"
                                    alt='product'
                                />
                            </div>
                            <div className="w-full flex flex-col justify-center items-start">
                                <p className="overflow-hidden truncate w-full text-lg font-bold">{product.name}</p>
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
