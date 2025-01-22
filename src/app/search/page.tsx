"use client"
import {Button, Checkbox, CheckboxGroup, Spinner} from '@heroui/react';
import {useSearch} from "@/src/hooks/useSearch";
import {upperFirst} from "tiny-case";
import Link from "next/link";
import Image from "next/image";
import {RetrieveProductResponse} from "@/src/stores/apis/productApi";

export default function Page() {
    const search = useSearch();
    const filters = ["name", "description", "category", "time", "location"]

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return (
        <div className="py-8 flex flex-col justify-center items-center">
            {/* Filters */}
            <section className="container flex justify-center items-center mb-8">
                <CheckboxGroup
                    defaultValue={filters}
                    onChange={(values: string[]) => search.setRequest({
                        ...search.searcherState.request,
                        filters: values
                    })}
                >
                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {filters.map((value, index) => (
                            <Checkbox
                                key={index}
                                value={value}
                            >
                                {upperFirst(value)}
                            </Checkbox>
                        ))}
                    </div>
                </CheckboxGroup>
            </section>

            {/* Products */}
            <section className="container flex flex-col justify-center items-center">
                <div className="flex flex-wrap justify-center items-center gap-6 mb-8 min-h-[80vh]">
                    {search.searcherState.products.map((product: RetrieveProductResponse, index: number) => (
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
                            <div className="w-full h-1/5 flex flex-col justify-center items-start">
                                <h3 className="overflow-hidden truncate w-full text-lg font-bold">{product.name}</h3>
                            </div>
                        </Link>
                    ))}
                    {search.productApiResult.isLoading && (<Spinner/>)}
                    {!search.productApiResult.isLoading && search.searcherState.products.length === 0 && (
                        <div className="flex justify-center">
                            Empty!
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={() => search.setPage(search.searcherState.request.page - 1)}
                    >
                        {'<'}
                    </Button>
                    <Button
                        disabled={true}
                    >
                        {search.searcherState.request.page + 1}
                    </Button>
                    <Button
                        onClick={() => search.setPage(search.searcherState.request.page + 1)}
                    >
                        {'>'}
                    </Button>
                </div>
            </section>
        </div>
    )
        ;
};

