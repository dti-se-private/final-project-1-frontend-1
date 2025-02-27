"use client";
import React from "react";
import {useWarehouseLedger} from "@/src/hooks/useWarehouseLedger";
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
    TableRow,
} from "@heroui/react";
import {WarehouseLedgerResponse} from "@/src/stores/apis/warehouseLedgerApi";
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import _ from "lodash";
import {useModal} from "@/src/hooks/useModal";

export default function WarehouseLedgerPage() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseLedgerState,
        getWarehouseLedgersApiResult,
        setGetWarehouseLedgersRequest,
        setDetails,
        addMutation,
        approveMutation,
        rejectMutation,
    } = useWarehouseLedger();

    const rowMapper = (item: WarehouseLedgerResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/admin/warehouse-ledgers/${item.id}`)}
                    >
                        Details
                    </Button>
                    <Button
                        color="success"
                        onPress={() =>
                            approveMutation({id: item.id})
                                .then((data) => {
                                    modal.setContent({
                                        header: "Approval Succeeded",
                                        body: `${data.message}`,
                                    });
                                })
                                .catch((error) => {
                                    modal.setContent({
                                        header: "Approval Failed",
                                        body: `${error.data.message}`,
                                    });
                                })
                                .finally(() => {
                                    modal.onOpenChange(true);
                                })
                        }
                    >
                        Approve
                    </Button>
                    <Button
                        color="danger"
                        onPress={() =>
                            rejectMutation({id: item.id})
                                .then((data) => {
                                    modal.setContent({
                                        header: "Rejection Succeeded",
                                        body: `${data.message}`,
                                    });
                                })
                                .catch((error) => {
                                    modal.setContent({
                                        header: "Rejection Failed",
                                        body: `${error.data.message}`,
                                    });
                                })
                                .finally(() => {
                                    modal.onOpenChange(true);
                                })
                        }
                    >
                        Reject
                    </Button>
                </div>
            );
        }

        return <>{String(getKeyValue(item, key))}</>;
    };

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="text-center mb-8 text-4xl font-bold">Stock Mutations</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseLedgerState.getWarehouseLedgersRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() =>
                                        setGetWarehouseLedgersRequest({
                                            page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                            size: warehouseLedgerState.getWarehouseLedgersRequest.size,
                                            search: "",
                                        })
                                    }
                                    onValueChange={_.debounce(
                                        (value) =>
                                            setGetWarehouseLedgersRequest({
                                                page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                                size: warehouseLedgerState.getWarehouseLedgersRequest.size,
                                                search: value,
                                            }),
                                        500
                                    )}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    onPress={() => router.push(`/admin/stock-mutations/add`)}
                                    color="success"
                                    className="text-white"
                                >
                                    Add Mutation
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) =>
                                        setGetWarehouseLedgersRequest({
                                            page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                            size: Number(event.target.value),
                                            search: warehouseLedgerState.getWarehouseLedgersRequest.search,
                                        })
                                    }
                                >
                                    <option selected value="5">
                                        5
                                    </option>
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
                                page={warehouseLedgerState.getWarehouseLedgersRequest.page + 1}
                                total={Infinity}
                                onChange={(page) =>
                                    setGetWarehouseLedgersRequest({
                                        page: page - 1,
                                        size: warehouseLedgerState.getWarehouseLedgersRequest.size,
                                        search: warehouseLedgerState.getWarehouseLedgersRequest.search,
                                    })
                                }
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="rowNumber">#</TableColumn>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="productId">Product ID</TableColumn>
                        <TableColumn key="originWarehouseId">Origin Warehouse</TableColumn>
                        <TableColumn key="destinationWarehouseId">Destination Warehouse</TableColumn>
                        <TableColumn key="quantity">Quantity</TableColumn>
                        <TableColumn key="status">Status</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehouseLedgersApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehouseLedgersApiResult.isFetching ? "loading" : "idle"}
                        emptyContent={"Empty!"}
                    >
                        {(item: WarehouseLedgerResponse) => (
                            <TableRow key={item?.id}>
                                <TableCell>
                                    {(getWarehouseLedgersApiResult.data?.data?.indexOf(item) ?? -1) + 1}
                                </TableCell>
                                <TableCell>{item?.id}</TableCell>
                                <TableCell>{item?.productId}</TableCell>
                                <TableCell>{item?.originWarehouseId}</TableCell>
                                <TableCell>{item?.destinationWarehouseId}</TableCell>
                                <TableCell>{item?.quantity}</TableCell>
                                <TableCell>{item?.status}</TableCell>
                                <TableCell>{rowMapper(item, "action")}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}