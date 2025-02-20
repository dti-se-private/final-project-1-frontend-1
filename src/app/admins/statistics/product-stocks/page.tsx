"use client"
import React from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Spinner, Select, SelectItem } from "@heroui/react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@heroui/shared-icons";
import _ from "lodash";
import { useModal } from "@/src/hooks/useModal";
import { useProductStockStatistics } from "@/src/hooks/useProductStockStatistics";
import { Chart } from "@/src/components/Chart";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        productStockStatisticsState,
        getProductStockStatisticsApiResult,
        setGetProductStockStatisticsRequest,
    } = useProductStockStatistics();

    // Mock data - replace with real data from your APIs
    const warehouseOptions = [{ id: "1", name: "Warehouse A" }, { id: "2", name: "Warehouse B" }];
    const productOptions = [{ id: "1", name: "Product 1" }, { id: "2", name: "Product 2" }];

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <div className="mb-8 text-4xl font-bold">Stock Statistics</div>
                
                <div className="w-full mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row w-full gap-4 flex-wrap">
                            <Select
                                label="Warehouse"
                                selectionMode="multiple"
                                placeholder="Select warehouses"
                                className="max-w-xs"
                                selectedKeys={productStockStatisticsState.getProductStockStatisticsRequest.warehouseIds}
                                onSelectionChange={(keys) => setGetProductStockStatisticsRequest({
                                    ...productStockStatisticsState.getProductStockStatisticsRequest,
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
                                label="Product"
                                selectionMode="multiple"
                                placeholder="Select products"
                                className="max-w-xs"
                                selectedKeys={productStockStatisticsState.getProductStockStatisticsRequest.productIds}
                                onSelectionChange={(keys) => setGetProductStockStatisticsRequest({
                                    ...productStockStatisticsState.getProductStockStatisticsRequest,
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
                                label="Operation"
                                className="max-w-xs"
                                selectedKeys={[productStockStatisticsState.getProductStockStatisticsRequest.operation]}
                                onSelectionChange={(keys) => setGetProductStockStatisticsRequest({
                                    ...productStockStatisticsState.getProductStockStatisticsRequest,
                                    operation: Array.from(keys)[0] as string
                                })}
                            >
                                <SelectItem key="STOCK_HISTORY" value="STOCK_HISTORY">Stock History</SelectItem>
                                <SelectItem key="STOCK_MOVEMENT" value="STOCK_MOVEMENT">Stock Movement</SelectItem>
                            </Select>

                            <Select
                                label="Aggregation"
                                className="max-w-xs"
                                selectedKeys={[productStockStatisticsState.getProductStockStatisticsRequest.aggregation]}
                                onSelectionChange={(keys) => setGetProductStockStatisticsRequest({
                                    ...productStockStatisticsState.getProductStockStatisticsRequest,
                                    aggregation: Array.from(keys)[0] as string
                                })}
                            >
                                <SelectItem key="DAILY" value="DAILY">Daily</SelectItem>
                                <SelectItem key="WEEKLY" value="WEEKLY">Weekly</SelectItem>
                                <SelectItem key="MONTHLY" value="MONTHLY">Monthly</SelectItem>
                            </Select>

                            <Select
                                label="Period"
                                className="max-w-xs"
                                selectedKeys={[productStockStatisticsState.getProductStockStatisticsRequest.period]}
                                onSelectionChange={(keys) => setGetProductStockStatisticsRequest({
                                    ...productStockStatisticsState.getProductStockStatisticsRequest,
                                    period: Array.from(keys)[0] as string
                                })}
                            >
                                <SelectItem key="2023" value="2023">2023</SelectItem>
                                <SelectItem key="2024" value="2024">2024</SelectItem>
                                <SelectItem key="2025" value="2025">2025</SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[500px]">
                    {getProductStockStatisticsApiResult.isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="lg" />
                        </div>
                    ) : getProductStockStatisticsApiResult.error ? (
                        <div className="flex justify-center items-center h-full text-danger">
                            Error loading statistics
                        </div>
                    ) : (
                        <Chart 
                            data={getProductStockStatisticsApiResult.data?.data || []}
                            aggregation={productStockStatisticsState.getProductStockStatisticsRequest.aggregation}
                            period={productStockStatisticsState.getProductStockStatisticsRequest.period}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}