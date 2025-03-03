"use client"
import {Autocomplete, AutocompleteItem, Select, SelectItem} from "@heroui/react";
import {useModal} from '@/src/hooks/useModal';
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import React, {useEffect, useState} from "react";
import {statisticApi} from "@/src/stores/apis/statisticApi";
import {useProduct} from "@/src/hooks/useProduct";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {CategoryResponse} from "@/src/stores/apis/categoryApi";
import {useCategory} from "@/src/hooks/useCategory";

export default function Page() {
    const modal = useModal();
    const {productState, setGetProductsRequest, getProductsApiResult} = useProduct();
    const {categoryState, setGetCategoriesRequest, getCategoriesApiResult} = useCategory();

    const dropdownAggregations: Record<string, string> = {
        sum: "Sum",
        avg: "Average"
    }
    const dropdownPeriods: Record<string, string> = {
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
    }
    const [selectedCategoryId, setSelectedCategoryId] = useState("all");
    const [selectedProductId, setSelectedProductId] = useState("all");
    const [selectedAggregation, setSelectedAggregation] = useState(new Set<string>(["sum"]));
    const [selectedPeriod, setSelectedPeriod] = useState(new Set<string>(["day"]));

    const defaultCategory: CategoryResponse = {
        id: "all",
        name: "All Categories",
    } as CategoryResponse;

    const defaultProduct: ProductResponse = {
        id: "all",
        name: "All Products",
    } as ProductResponse;

    useEffect(() => {
        setGetCategoriesRequest({
            size: categoryState.getCategoriesRequest.size,
            page: categoryState.getCategoriesRequest.page,
            search: defaultCategory.name,
        })
        setGetProductsRequest({
            size: productState.getProductsRequest.size,
            page: productState.getProductsRequest.page,
            search: defaultProduct.name,
        });
    }, []);

    const categories = [defaultCategory, ...(getCategoriesApiResult.data?.data ?? [])];
    const products = [defaultProduct, ...(getProductsApiResult.data?.data ?? [])];

    const getProductSalesStatisticApiResult = statisticApi.useGetProductSalesQuery({
        categoryIds: selectedCategoryId === "all" ? [] : [selectedCategoryId],
        productIds: selectedProductId === "all" ? [] : [selectedProductId],
        aggregation: Array.from(selectedAggregation)[0],
        period: Array.from(selectedPeriod)[0],
    });

    useEffect(() => {
        getProductSalesStatisticApiResult.refetch();
    }, [selectedCategoryId, selectedProductId, selectedAggregation, selectedPeriod]);

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh] gap-4">
                <h1 className="text-center mb-4 text-4xl font-bold">Product Sales Statistics</h1>
                <div className="flex flex-col w-full gap-4">
                    <Autocomplete
                        className="w-full"
                        fullWidth={true}
                        label="Category"
                        placeholder="Type to search..."
                        selectedKey={selectedCategoryId}
                        inputValue={categoryState.getCategoriesRequest.search}
                        isLoading={getCategoriesApiResult.isFetching}
                        items={categories}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetCategoriesRequest({
                                size: categoryState.getCategoriesRequest.size,
                                page: categoryState.getCategoriesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            const item = categories.find((item) => item.id === key);
                            if (key === "all") {
                                setGetCategoriesRequest({
                                    size: categoryState.getCategoriesRequest.size,
                                    page: categoryState.getCategoriesRequest.page,
                                    search: `${item?.name}`,
                                });
                            } else {
                                setGetCategoriesRequest({
                                    size: categoryState.getCategoriesRequest.size,
                                    page: categoryState.getCategoriesRequest.page,
                                    search: `${item?.id} - ${item?.name}`,
                                });
                            }
                            setSelectedCategoryId(key as string);
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {item.id === "all" ? item.name : `${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <Autocomplete
                        className="w-full"
                        fullWidth={true}
                        label="Product"
                        placeholder="Type to search..."
                        selectedKey={selectedProductId}
                        inputValue={productState.getProductsRequest.search}
                        isLoading={getProductsApiResult.isFetching}
                        items={products}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetProductsRequest({
                                size: productState.getProductsRequest.size,
                                page: productState.getProductsRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            const item = products.find((item) => item.id === key);
                            if (key === "all") {
                                setGetProductsRequest({
                                    size: productState.getProductsRequest.size,
                                    page: productState.getProductsRequest.page,
                                    search: `${item?.name}`,
                                });
                            } else {
                                setGetProductsRequest({
                                    size: productState.getProductsRequest.size,
                                    page: productState.getProductsRequest.page,
                                    search: `${item?.id} - ${item?.name}`,
                                });
                            }
                            setSelectedProductId(key as string);
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {item.id === "all" ? item.name : `${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                </div>
                <div className="flex flex-col md:flex-row w-full gap-4">
                    <Select
                        className="w-full capitalize flex justify-between"
                        fullWidth={false}
                        label="Aggregation"
                        disallowEmptySelection
                        selectedKeys={selectedAggregation}
                        selectionMode="single"
                        onSelectionChange={(keys) => setSelectedAggregation(keys as Set<string>)}
                    >
                        {
                            Object.entries(dropdownAggregations).map(([key, value]) => (
                                <SelectItem key={key}>{value}</SelectItem>
                            ))
                        }
                    </Select>
                    <Select
                        className="w-full capitalize flex justify-between"
                        fullWidth={false}
                        label="Period"
                        disallowEmptySelection
                        selectedKeys={selectedPeriod}
                        selectionMode="single"
                        onSelectionChange={(keys) => setSelectedPeriod(keys as Set<string>)}
                    >
                        {
                            Object.entries(dropdownPeriods).map(([key, value]) => (
                                <SelectItem key={key}>{value}</SelectItem>
                            ))
                        }
                    </Select>
                </div>
                <div className="w-full h-full flex justify-center items-center">
                    <LineChart data={getProductSalesStatisticApiResult.data?.data ?? []} width={1024} height={400}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="x"/>
                        <YAxis/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="y"/>
                    </LineChart>
                </div>
            </div>
        </div>
    );
}
