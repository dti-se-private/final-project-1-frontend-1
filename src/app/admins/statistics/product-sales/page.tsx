"use client"
import React from "react";
import {Select, SelectItem, Spinner} from "@heroui/react";
import {useRouter} from "next/navigation";
import {useModal} from "@/src/hooks/useModal";
import {useProductSalesStatistics} from "@/src/hooks/useProductSalesStatistics";
import {Chart} from "@/src/components/Chart";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        productSalesStatisticsState,
        getProductSalesStatisticsApiResult,
        setGetProductSalesStatisticsRequest,
    } = useProductSalesStatistics();

    // Mock data - replace with real data from your APIs
    const warehouseOptions = [{id: "1", name: "Warehouse A"}, {id: "2", name: "Warehouse B"}];
    const categoryOptions = [{id: "1", name: "Category X"}, {id: "2", name: "Category Y"}];
    const productOptions = [{id: "1", name: "Product 1"}, {id: "2", name: "Product 2"}];

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <div className="mb-8 text-4xl font-bold">Sales Statistics</div>

                <div className="w-full mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row w-full gap-4 flex-wrap">
                            <Select
                                label="Warehouse"
                                selectionMode="multiple"
                                placeholder="Select warehouses"
                                className="max-w-xs"
                                selectedKeys={productSalesStatisticsState.getProductSalesStatisticsRequest.warehouseIds}
                                onSelectionChange={(keys) => setGetProductSalesStatisticsRequest({
                                    ...productSalesStatisticsState.getProductSalesStatisticsRequest,
                                    warehouseIds: Array.from(keys) as string[]
                                })}
                            >
                                {warehouseOptions.map((warehouse) => (
                                    <SelectItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Category"
                                selectionMode="multiple"
                                placeholder="Select categories"
                                className="max-w-xs"
                                selectedKeys={productSalesStatisticsState.getProductSalesStatisticsRequest.categoryIds}
                                onSelectionChange={(keys) => setGetProductSalesStatisticsRequest({
                                    ...productSalesStatisticsState.getProductSalesStatisticsRequest,
                                    categoryIds: Array.from(keys) as string[]
                                })}
                            >
                                {categoryOptions.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Product"
                                selectionMode="multiple"
                                placeholder="Select products"
                                className="max-w-xs"
                                selectedKeys={productSalesStatisticsState.getProductSalesStatisticsRequest.productIds}
                                onSelectionChange={(keys) => setGetProductSalesStatisticsRequest({
                                    ...productSalesStatisticsState.getProductSalesStatisticsRequest,
                                    productIds: Array.from(keys) as string[]
                                })}
                            >
                                {productOptions.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="Aggregation"
                                className="max-w-xs"
                                selectedKeys={new Set([productSalesStatisticsState.getProductSalesStatisticsRequest.aggregation])}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys).at(0) as "sum" | "average" | "count" | undefined;
                                    setGetProductSalesStatisticsRequest({
                                        ...productSalesStatisticsState.getProductSalesStatisticsRequest,
                                        aggregation: key || "sum"
                                    });
                                }}
                            >
                                <SelectItem key="sum" value="sum">Sum</SelectItem>
                                <SelectItem key="average" value="average">Average</SelectItem>
                                <SelectItem key="count" value="count">Count</SelectItem>
                            </Select>

                            <Select
                                label="Period"
                                className="max-w-xs"
                                selectedKeys={new Set([productSalesStatisticsState.getProductSalesStatisticsRequest.period])}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys).at(0) as "day" | "week" | "month" | undefined;
                                    setGetProductSalesStatisticsRequest({
                                        ...productSalesStatisticsState.getProductSalesStatisticsRequest,
                                        period: key || "day"
                                    });
                                }}
                            >
                                <SelectItem key="day" value="day">Daily</SelectItem>
                                <SelectItem key="week" value="week">Weekly</SelectItem>
                                <SelectItem key="month" value="month">Monthly</SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[500px]">
                    {getProductSalesStatisticsApiResult.isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="lg"/>
                        </div>
                    ) : getProductSalesStatisticsApiResult.error ? (
                        <div className="flex justify-center items-center h-full text-danger">
                            Error loading statistics
                        </div>
                    ) : (
                        <Chart
                            data={getProductSalesStatisticsApiResult.data?.data || []}
                            aggregation={productSalesStatisticsState.getProductSalesStatisticsRequest.aggregation}
                            period={productSalesStatisticsState.getProductSalesStatisticsRequest.period}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}