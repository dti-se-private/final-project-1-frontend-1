'use client'

import Link from 'next/link';
import {
    Button,
    getKeyValue,
    Input,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useOrder} from "@/src/hooks/useOrder";
import {useParams, useRouter} from "next/navigation";
import {orderApi, OrderItemResponse, OrderProcessRequest, OrderStatusResponse} from "@/src/stores/apis/orderApi";
import moment from "moment";

export default function Page() {
    const {orderId}: { orderId: string } = useParams();
    const router = useRouter();
    const {
        orderState,
        setDetails,
        processCancellation,
        processPaymentGateway,
        processShipmentConfirmation
    } = useOrder();
    const modal = useModal();

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const detailOrderApiResult = orderApi.useGetOrderQuery({
        id: orderId,
    });

    useEffect(() => {
        if (detailOrderApiResult.data?.data) {
            setDetails(detailOrderApiResult.data.data);
        }
    }, [detailOrderApiResult.data?.data]);


    if (detailOrderApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    const rowMapperItems = (item: OrderItemResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        as={Link}
                        href={`/products/${item.product.id}`}
                    >
                        Details
                    </Button>
                </div>
            );
        } else if (key === "productId") {
            return (
                <>
                    {item.product.id}
                </>
            );
        } else if (key === "productName") {
            return (
                <>
                    {item.product.name}
                </>
            );
        } else {
            return (
                <>
                    {String(getKeyValue(item, key))}
                </>
            );
        }
    }
    const rowMapperStatuses = (item: OrderStatusResponse, key: string): React.JSX.Element => {
        const statuses = orderState.details?.statuses ?? [];
        const lastStatus = statuses.length > 0 ? statuses[statuses.length - 1] : undefined;
        const isLast = lastStatus?.id === item.id;
        const statusGroups = orderState.details?.statuses.filter((status) => status.status === item.status) ?? [];
        const isLastInStatusGroups = statusGroups.length > 0 ? statusGroups[statusGroups.length - 1].id === item.id : false;
        if (key === "action") {
            if (isLastInStatusGroups) {
                if (item.status === "WAITING_FOR_PAYMENT" && isLast) {
                    return (
                        <div className="flex flex-row gap-2">
                            <Button
                                color="danger"
                                onPress={() => {
                                    const request: OrderProcessRequest = {
                                        orderId: orderId,
                                        action: "CANCEL"
                                    }
                                    processCancellation(request)
                                        .then((data) => {
                                            modal.setContent({
                                                header: "Process Cancellation Succeed",
                                                body: `${data.message}`,
                                            })
                                        })
                                        .catch((error) => {
                                            modal.setContent({
                                                header: "Process Cancellation Failed",
                                                body: `${error.data.message}`,
                                            })
                                        })
                                        .finally(() => {
                                            modal.onOpenChange(true);
                                            detailOrderApiResult.refetch();
                                        });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    );
                } else if (item.status === "WAITING_FOR_PAYMENT_CONFIRMATION") {
                    return (
                        <div className="flex flex-row gap-2">
                            <Button
                                color="primary"
                                as={Link}
                                href={`/admins/orders/${orderId}/payment-proofs`}
                            >
                                Details
                            </Button>
                            {isLast &&
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        const request: OrderProcessRequest = {
                                            orderId: orderId,
                                            action: "CANCEL"
                                        }
                                        processCancellation(request)
                                            .then((data) => {
                                                modal.setContent({
                                                    header: "Process Cancellation Succeed",
                                                    body: `${data.message}`,
                                                })
                                            })
                                            .catch((error) => {
                                                modal.setContent({
                                                    header: "Process Cancellation Failed",
                                                    body: `${error.data.message}`,
                                                })
                                            })
                                            .finally(() => {
                                                modal.onOpenChange(true);
                                                detailOrderApiResult.refetch();
                                            });
                                    }}
                                >
                                    Cancel
                                </Button>
                            }
                        </div>
                    )
                } else if (item.status === "SHIPPING" && isLast) {
                    return (
                        <Button
                            color="primary"
                            onPress={() => {
                                const request: OrderProcessRequest = {
                                    orderId: orderId,
                                    action: "APPROVE"
                                }
                                processShipmentConfirmation(request)
                                    .then((data) => {
                                        modal.setContent({
                                            header: "Process Shipment Confirmation Succeed",
                                            body: `${data.message}`,
                                        })
                                    })
                                    .catch((error) => {
                                        modal.setContent({
                                            header: "Process Shipment Confirmation Failed",
                                            body: `${error.data.message}`,
                                        })
                                    })
                                    .finally(() => {
                                        modal.onOpenChange(true);
                                        detailOrderApiResult.refetch();
                                    });
                            }}
                        >
                            Approve
                        </Button>
                    );
                } else {
                    return (<></>);
                }
            } else {
                return (<></>);
            }
        } else if (key === "time") {
            return (
                <>
                    {moment(item.time).local().toString()}
                </>
            );
        } else if (key === "status") {
            return (
                <>
                    {item.status.replace(/_/g, ' ')}
                </>
            );
        } else {
            return (
                <>
                    {String(getKeyValue(item, key))}
                </>
            );
        }
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Order Details</div>
                <div className="flex flex-col gap-8 w-2/3 h-full">
                    <div className="flex flex-col gap-4">
                        <Input
                            label="ID"
                            type="text"
                            value={orderState.details?.id ?? ""}
                        />
                        <div className="flex flex-row gap-4">
                            <Input
                                label="Item Price"
                                type="text"
                                value={currencyFormatter.format(orderState.details?.itemPrice ?? 0)}
                            />
                            <Input
                                label="Shipment Price"
                                type="text"
                                value={currencyFormatter.format(orderState.details?.shipmentPrice ?? 0)}
                            />
                        </div>
                        <Input
                            label="Total Price"
                            type="text"
                            value={currencyFormatter.format(orderState.details?.totalPrice ?? 0)}
                        />
                        <div className="flex flex-row gap-4">
                            <Input
                                label="Origin Warehouse ID"
                                type="text"
                                value={orderState.details?.originWarehouse.id ?? ""}
                            />
                            <Input
                                label="Origin Warehouse Name"
                                type="text"
                                value={orderState.details?.originWarehouse.name ?? ""}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-2xl">Items</div>
                        <Table>
                            <TableHeader>
                                <TableColumn key="productId">Product ID</TableColumn>
                                <TableColumn key="productName">Product Name</TableColumn>
                                <TableColumn key="quantity">Quantity</TableColumn>
                                <TableColumn key="action">Action</TableColumn>
                            </TableHeader>
                            <TableBody
                                emptyContent={"Empty!"}
                            >
                                {(orderState.details?.items ?? []).map((item) => (
                                    <TableRow key={item?.id}>
                                        {(columnKey) =>
                                            <TableCell>{rowMapperItems(item, String(columnKey))}</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="text-2xl">Statuses</div>
                        <Table>
                            <TableHeader>
                                <TableColumn key="status">Status</TableColumn>
                                <TableColumn key="time">Time</TableColumn>
                                <TableColumn key="action">Action</TableColumn>
                            </TableHeader>
                            <TableBody
                                emptyContent={"Empty!"}
                            >
                                {(orderState.details?.statuses ?? []).map((item) => (
                                    <TableRow key={item?.id}>
                                        {(columnKey) =>
                                            <TableCell>{rowMapperStatuses(item, String(columnKey))}</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}