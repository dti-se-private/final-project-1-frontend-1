'use client'

import Link from 'next/link';
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
import {useModal} from "@/src/hooks/useModal";
import moment from "moment";

;

export default function WarehouseLedgerPage() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseLedgerState,
        getMutationRequestsApiResult,
        setGetMutationRequestsRequest,
        setDetails,
        addMutationRequest,
        approveMutationRequest,
        rejectMutationRequest,
    } = useWarehouseLedger();

    useEffect(() => {
        setGetMutationRequestsRequest({
            page: warehouseLedgerState.getMutationRequestsRequest.page,
            size: warehouseLedgerState.getMutationRequestsRequest.size,
            search: "",
        });
    }, [])

    const rowMapper = (item: WarehouseLedgerResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-col gap-2">
                    <Button
                        color="primary"
                        as={Link}
                        href={`/admins/stock-mutations/${item.id}`}
                    >
                        Details
                    </Button>
                    {item.status === "WAITING_FOR_APPROVAL" && (
                        <>
                            <Button
                                color="warning"
                                className="text-white"
                                onPress={() =>
                                    approveMutationRequest({warehouseLedgerId: item.id})
                                        .then((data) => {
                                            modal.setContent({
                                                header: "Approval Succeed",
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
                                    rejectMutationRequest({warehouseLedgerId: item.id})
                                        .then((data) => {
                                            modal.setContent({
                                                header: "Rejection Succeed",
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
                        </>
                    )}
                </div>
            );
        } else if (key === "productId") {
            return (
                <>
                    {item.originWarehouseProduct.product.id}
                </>
            );
        } else if (key === "status") {
            return (
                <>
                    {item.status.replace(/_/g, ' ')}
                </>
            );
        } else if (key === "time") {
            return (
                <>
                    {moment(item.time).local().toString()}
                </>
            );
        }

        return <>{String(getKeyValue(item, key))}</>;
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="text-center mb-8 text-4xl font-bold">Stock Mutations</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseLedgerState.getMutationRequestsRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetMutationRequestsRequest({
                                        page: warehouseLedgerState.getMutationRequestsRequest.page,
                                        size: warehouseLedgerState.getMutationRequestsRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetMutationRequestsRequest({
                                        page: warehouseLedgerState.getMutationRequestsRequest.page,
                                        size: warehouseLedgerState.getMutationRequestsRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    color="success"
                                    className={"text-white"}
                                    as={Link}
                                    href={`/admins/stock-mutations/add`}
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetMutationRequestsRequest({
                                        page: warehouseLedgerState.getMutationRequestsRequest.page,
                                        size: Number(event.target.value),
                                        search: warehouseLedgerState.getMutationRequestsRequest.search
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
                                page={warehouseLedgerState.getMutationRequestsRequest.page + 1}
                                total={Infinity}
                                onChange={(page) =>
                                    setGetMutationRequestsRequest({
                                        page: page - 1,
                                        size: warehouseLedgerState.getMutationRequestsRequest.size,
                                        search: warehouseLedgerState.getMutationRequestsRequest.search,
                                    })
                                }
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="productId">Product ID</TableColumn>
                        <TableColumn key="status">Status</TableColumn>
                        <TableColumn key="time">Time</TableColumn>
                        <TableColumn key="action">Actions</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getMutationRequestsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getMutationRequestsApiResult.isFetching ? "loading" : "idle"}
                        emptyContent={"Empty!"}
                    >
                        {(item) => (
                            <TableRow key={item?.id}>
                                {(columnKey) => <TableCell>{rowMapper(item, String(columnKey))}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}