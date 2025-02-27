"use client"
import React, {useEffect} from "react";
import {useWarehouseProduct} from "@/src/hooks/useWarehouseProduct";
import {Icon} from "@iconify/react";
import {
    Button,
    getKeyValue,
    Input,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import {WarehouseProductResponse} from "@/src/stores/apis/warehouseProductApi";
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseProductState,
        getWarehouseProductsApiResult,
        setGetWarehouseProductsRequest,
        setDetails,
        deleteWarehouseProduct,
    } = useWarehouseProduct();


    useEffect(() => {
        setGetWarehouseProductsRequest({
            page: warehouseProductState.getWarehouseProductsRequest.page,
            size: warehouseProductState.getWarehouseProductsRequest.size,
            search: "",
        });
    }, [])

    const rowMapper = (item: WarehouseProductResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/admins/warehouse-products/${item.id}`)}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => deleteWarehouseProduct({id: item.id})
                            .then((data) => {
                                modal.setContent({
                                    header: "Delete Succeed",
                                    body: `${data.message}`,
                                })
                            })
                            .catch((error) => {
                                modal.setContent({
                                    header: "Delete Failed",
                                    body: `${error.data.message}`,
                                })
                            }).finally(() => {
                                modal.onOpenChange(true);
                            })
                        }
                    >
                        Delete
                    </Button>
                </div>
            );
        }

        return (
            <>
                {String(getKeyValue(item, key))}
            </>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Warehouse Products</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseProductState.getWarehouseProductsRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetWarehouseProductsRequest({
                                        page: warehouseProductState.getWarehouseProductsRequest.page,
                                        size: warehouseProductState.getWarehouseProductsRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetWarehouseProductsRequest({
                                        page: warehouseProductState.getWarehouseProductsRequest.page,
                                        size: warehouseProductState.getWarehouseProductsRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    onPress={() => router.push(`/admins/warehouse-products/add`)}
                                    color="success"
                                    className="text-white"
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetWarehouseProductsRequest({
                                        page: warehouseProductState.getWarehouseProductsRequest.page,
                                        size: Number(event.target.value),
                                        search: warehouseProductState.getWarehouseProductsRequest.search
                                    })}
                                >
                                    <option selected value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </label>
                        </div>
                    }
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                showControls
                                showShadow
                                page={warehouseProductState.getWarehouseProductsRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetWarehouseProductsRequest({
                                    page: page - 1,
                                    size: warehouseProductState.getWarehouseProductsRequest.size,
                                    search: warehouseProductState.getWarehouseProductsRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="rowNumber">#</TableColumn>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="warehouseId">Warehouse ID</TableColumn>
                        <TableColumn key="productId">Product ID</TableColumn>
                        <TableColumn key="quantity">Quantity</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehouseProductsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehouseProductsApiResult.isFetching ? "loading" : "idle"}
                        emptyContent={"Empty!"}
                    >
                        {
                            (item: WarehouseProductResponse) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{getWarehouseProductsApiResult.data?.data?.indexOf(item) ? getWarehouseProductsApiResult.data?.data?.indexOf(item) + 1 : 0 + 1}</TableCell>
                                    <TableCell>{item?.id}</TableCell>
                                    <TableCell>{item?.warehouse.id}</TableCell>
                                    <TableCell>{item?.product.id}</TableCell>
                                    <TableCell>{item?.quantity}</TableCell>
                                    <TableCell>{rowMapper(item, "action")}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}