"use client"
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger, Select, SelectItem
} from "@heroui/react";
import {useModal} from '@/src/hooks/useModal';
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import React, {useEffect, useState} from "react";
import {SharedSelection} from "@heroui/system";
import {ChevronDownIcon} from "@heroui/shared-icons";
import {statisticApi} from "@/src/stores/apis/statisticApi";
import {useProduct} from "@/src/hooks/useProduct";
import {ProductResponse} from "@/src/stores/apis/productApi";

export default function Page() {
    const modal = useModal();
    const {productState, setGetProductsRequest, getProductsApiResult} = useProduct();

    const dropdownOperation: Record<string, string> = {
        current: "Current",
        increment: "Increment",
        decrement: "Decrement",
    }
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
    const [selectedProductId, setSelectedProductId] = useState("all");
    const [selectedOperation, setSelectedOperation] = useState(new Set<string>(["current"]));
    const [selectedAggregation, setSelectedAggregation] = useState(new Set<string>(["sum"]));
    const [selectedPeriod, setSelectedPeriod] = useState(new Set<string>(["day"]));

    const defaultProduct: ProductResponse = {
        id: "all",
        name: "All Products",
    } as ProductResponse;

    useEffect(() => {
        setGetProductsRequest({
            size: productState.getProductsRequest.size,
            page: productState.getProductsRequest.page,
            search: defaultProduct.name,
        });
    }, []);

    const products = [defaultProduct, ...(getProductsApiResult.data?.data ?? [])];

    const getProductStockStatisticApiResult = statisticApi.useGetProductStockQuery({
        productIds: selectedProductId === "all" ? [] : [selectedProductId],
        operation: Array.from(selectedOperation)[0],
        aggregation: Array.from(selectedAggregation)[0],
        period: Array.from(selectedPeriod)[0],
    });

    useEffect(() => {
        getProductStockStatisticApiResult.refetch();
    }, [selectedProductId, selectedOperation, selectedAggregation, selectedPeriod]);

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Product Stocks Statistics</h1>
                <div className="flex flex-col justify-center items-between gap-4 w-full">
                    <div className="flex md:flex-row flex-col justify-center items-center md:justify-between md:items-center w-full gap-4">
                        <Autocomplete
                            className="w-full"
                            fullWidth={true}
                            name="productId"
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
                        <Select
                            className="md:w-[10%] w-full capitalize flex justify-between"
                            fullWidth={false}
                            disallowEmptySelection
                            selectedKeys={selectedOperation}
                            selectionMode="single"
                            onSelectionChange={(keys: SharedSelection) => setSelectedOperation(keys as Set<string>)}
                            >
                            {
                                Object.entries(dropdownOperation).map(([key, value]) => (
                                    <SelectItem key={key}>{value}</SelectItem>
                                ))
                            }
                        </Select>
                        <Select
                            className="md:w-[10%] w-full capitalize flex justify-between"
                            fullWidth={false}
                            disallowEmptySelection
                            selectedKeys={selectedAggregation}
                            selectionMode="single"
                            onSelectionChange={(keys: SharedSelection) => setSelectedAggregation(keys as Set<string>)}
                        >
                            {
                                Object.entries(dropdownAggregations).map(([key, value]) => (
                                    <SelectItem key={key}>{value}</SelectItem>
                                ))
                            }
                        </Select>
                        <Select
                            className="md:w-[10%] w-full capitalize flex justify-between"
                            fullWidth={false}
                            disallowEmptySelection
                            selectedKeys={selectedPeriod}
                            selectionMode="single"
                            onSelectionChange={(keys: SharedSelection) => setSelectedPeriod(keys as Set<string>)}
                        >
                            {
                                Object.entries(dropdownPeriods).map(([key, value]) => (
                                    <SelectItem key={key}>{value}</SelectItem>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className="w-full h-full flex justify-center items-center">
                    <LineChart data={getProductStockStatisticApiResult.data?.data ?? []} width={1024} height={400}>
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
