'use client'

import Link from 'next/link';
import {Button, Spinner} from '@heroui/react';
import Image from 'next/image';
import {useProduct} from '@/src/hooks/useProduct';
import {upperFirst} from "tiny-case";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useRouter} from "next/navigation";
import {CategoryResponse} from "@/src/stores/apis/categoryApi";
import {useEffect} from "react";
import hero1 from "@/public/hero1.png";
import hero2 from "@/public/hero2.png";
import hero3 from "@/public/hero3.png";
import hero4 from "@/public/hero4.png";

export default function Page() {
    const router = useRouter();
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

    const categories = [
        {id: "", name: "all", description: "all"} as CategoryResponse,
        ...categoryApiResult.data?.data?.slice(0, 10) ?? []
    ]

    const heroImages = [
        hero1,
        hero2,
        hero3,
        hero4
    ];

    return (
        <div className="pb-8 flex flex-col justify-center items-center">
            {/* Hero */}
            <section className="w-full mb-4">
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
                        heroImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="cursor-pointer w-full h-[24vh] md:h-[79vh] relative mb-12">
                                    <Image
                                        className="rounded-md"
                                        src={image}
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
                            variant={productState.category?.id === category.id ? 'solid' : 'bordered'}
                        >
                            {upperFirst(category.name)}
                        </Button>
                    ))}
                </div>
            </section>

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
