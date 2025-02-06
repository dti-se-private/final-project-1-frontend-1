"use client"
import {Button, Spinner} from '@heroui/react';
import Image from 'next/image';
import {useLanding} from '@/src/hooks/useLanding';
import Link from 'next/link'
import {upperFirst} from "tiny-case";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";

export default function Page() {
    const landing = useLanding();
    const categories = ['all', 'appliance', 'fashion', 'food', 'gadget', 'health', 'sport', 'toys', 'vehicle'];

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

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
            <section className="container flex flex-col justify-center items-center mb-8">
                <div className="flex flex-wrap justify-center items-center gap-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onPress={() => landing.setCategory(category)}
                            variant={(landing.searcherState.request.search === "" && category === "all") || (landing.searcherState.request.search === category) ? 'solid' : 'bordered'}
                        >
                            {upperFirst(category)}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Products */}
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 min-h-[80vh]">
                    {landing.searcherState.products.map((product, index) => (
                        <Link
                            href={`/products/${product.id}`}
                            key={index}
                            className="flex flex-col justify-center items-center p-4 border-gray-300 rounded-lg shadow-md w-3/4 md:w-1/4 h-full"
                        >
                            <div className="relative w-full min-h-[30vh] mb-4">
                                <Image
                                    className="rounded-md"
                                    src={product.image ?? "https://placehold.co/1366x768?text=product"}
                                    layout="fill"
                                    objectFit="cover"
                                    alt='product'
                                />
                            </div>
                            <div className="w-full min-h-[15vh] flex flex-col justify-center items-start">
                                <h3 className="overflow-hidden truncate w-full text-lg font-bold">{product.name}</h3>
                            </div>
                        </Link>
                    ))}
                    {landing.productApiResult.isLoading && (<Spinner/>)}
                    {!landing.productApiResult.isLoading && landing.searcherState.products.length === 0 && (
                        <div className="flex justify-center">
                            Empty!
                        </div>
                    )}
                </div>


                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onPress={() => landing.setPage(landing.searcherState.request.page - 1)}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {landing.searcherState.request.page + 1}
                    </Button>
                    <Button
                        onPress={() => landing.setPage(landing.searcherState.request.page + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </section>
        </div>
    );
};
