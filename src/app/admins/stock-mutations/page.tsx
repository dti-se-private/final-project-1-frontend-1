"use client";
import React, {useEffect} from "react";
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

    useEffect(() => {
        setGetWarehouseLedgersRequest({
            page: warehouseLedgerState.getWarehouseLedgersRequest.page,
            size: warehouseLedgerState.getWarehouseLedgersRequest.size,
            search: "",
        });
    }, [])

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
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseLedgerState.getWarehouseLedgersRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetWarehouseLedgersRequest({
                                        page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                        size: warehouseLedgerState.getWarehouseLedgersRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetWarehouseLedgersRequest({
                                        page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                        size: warehouseLedgerState.getWarehouseLedgersRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    color="success"
                                    className={"text-white"}
                                    onPress={() => router.push(`/admins/stock-mutations/request`)}
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetWarehouseLedgersRequest({
                                        page: warehouseLedgerState.getWarehouseLedgersRequest.page,
                                        size: Number(event.target.value),
                                        search: warehouseLedgerState.getWarehouseLedgersRequest.search
                                    })}
                                    defaultValue={5}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
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
                        <TableColumn key="preQuantity">Pre Quantity</TableColumn>
                        <TableColumn key="postQuantity">Post Quantity</TableColumn>
                        <TableColumn key="time">Time</TableColumn>
                        <TableColumn key="action">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehouseLedgersApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehouseLedgersApiResult.isFetching ? "loading" : "idle"}
                        emptyContent={"Empty!"}
                    >
                        {(item: WarehouseLedgerResponse) => (
                            <TableRow key={item?.id}>
                                <TableCell>{getWarehouseLedgersApiResult.data?.data?.indexOf(item) ? getWarehouseLedgersApiResult.data?.data?.indexOf(item) + 1 : 0 + 1}</TableCell>
                                <TableCell>{item?.id}</TableCell>
                                <TableCell>{item?.productId}</TableCell>
                                <TableCell>{item?.preQuantity}</TableCell>
                                <TableCell>{item?.postQuantity}</TableCell>
                                <TableCell>{item?.time}</TableCell>
                                <TableCell>{rowMapper(item, "action")}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}