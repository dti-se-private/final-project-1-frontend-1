"use client"
import React, {useEffect} from "react";
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
import {OrderResponse} from "@/src/stores/apis/orderApi";
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import {useModal} from "@/src/hooks/useModal";
import {useOrder} from "@/src/hooks/useOrder";
import moment from "moment";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        orderState,
        getOrdersApiResult,
        setGetOrdersRequest
    } = useOrder();

    useEffect(() => {
        setGetOrdersRequest({
            page: orderState.getOrdersRequest.page,
            size: orderState.getOrdersRequest.size,
            search: "",
        });
    }, [])

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const rowMapper = (item: OrderResponse, key: string): React.JSX.Element => {
        const statuses = item.statuses ?? [];
        const lastStatus = statuses.length > 0 ? statuses[statuses.length - 1] : undefined;
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/customers/orders/${item.id}`)}
                    >
                        Details
                    </Button>
                </div>
            );
        } else if (key === "lastStatus") {
            return (
                <>
                    {lastStatus?.status}
                </>
            );
        } else if (key === "lastStatusTime") {
            return (
                <>
                    {moment(lastStatus?.time).local().toString()}
                </>
            );
        } else if (key === "totalPrice") {
            return (
                <>
                    {currencyFormatter.format(getKeyValue(item, key))}
                </>
            );
        }

        return (
            <>
                {String(getKeyValue(item, key))}
            </>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <div className="mb-8 text-4xl font-bold">Orders</div>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={orderState.getOrdersRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetOrdersRequest({
                                        page: orderState.getOrdersRequest.page,
                                        size: orderState.getOrdersRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetOrdersRequest({
                                        page: orderState.getOrdersRequest.page,
                                        size: orderState.getOrdersRequest.size,
                                        search: value
                                    })}
                                />
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetOrdersRequest({
                                        page: orderState.getOrdersRequest.page,
                                        size: Number(event.target.value),
                                        search: orderState.getOrdersRequest.search
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
                                page={orderState.getOrdersRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetOrdersRequest({
                                    page: page - 1,
                                    size: orderState.getOrdersRequest.size,
                                    search: orderState.getOrdersRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="totalPrice">Total Price</TableColumn>
                        <TableColumn key="lastStatus">Last Status</TableColumn>
                        <TableColumn key="lastStatusTime">Last Status Time</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getOrdersApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getOrdersApiResult.isFetching ? "loading" : "idle"}
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
    )
}