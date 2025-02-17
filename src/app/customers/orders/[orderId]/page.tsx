"use client"
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
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
import {
    orderApi,
    OrderItemResponse,
    OrderProcessRequest,
    OrderStatusResponse,
    PaymentGatewayRequest
} from "@/src/stores/apis/orderApi";

export default function Page() {
    const {orderId}: { orderId: string } = useParams();
    const router = useRouter();
    const {
        orderState,
        setDetails,
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


    if (detailOrderApiResult.isFetching) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
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
                        onPress={() => router.push(`/products/${item.product.id}`)}
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
        }

        return (
            <>
                {String(getKeyValue(item, key))}
            </>
        );
    }
    const rowMapperStatuses = (item: OrderStatusResponse, key: string): React.JSX.Element => {
        const lastStatus = orderState.details?.statuses[orderState.details?.statuses.length - 1].status;
        if (key === "action") {
            if (item.status === "WAITING_FOR_PAYMENT" && lastStatus === "WAITING_FOR_PAYMENT") {
                return (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Button color="primary">Pay</Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem
                                key="automatic"
                                onPress={() => {
                                    const request: PaymentGatewayRequest = {
                                        orderId: orderId,
                                    };
                                    processPaymentGateway(request)
                                        .then((data) => {
                                            modal.setContent({
                                                header: "Process Payment Gateway Succeed",
                                                body: `${data.message}`,
                                            })
                                            window.open(data.data?.url, "_blank");
                                        })
                                        .catch((error) => {
                                            modal.setContent({
                                                header: "Process Payment Gateway Failed",
                                                body: `${error.data.message}`,
                                            })
                                        })
                                        .finally(() => {
                                            modal.onOpenChange(true);
                                        });
                                }}
                            >
                                Automatic
                            </DropdownItem>
                            <DropdownItem key="manual">Manual</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            } else if (item.status === "SHIPPING" && lastStatus === "SHIPPING") {
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
            }
            {
                return (<></>);
            }
        } else if (key === "time") {
            return (
                <>
                    {new Date(item.time * 1000).toLocaleString()}
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
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Order Details</div>
                <div className="flex flex-col gap-8 w-2/3 h-full">
                    <div className="flex flex-col gap-4">
                        <Input
                            label="ID"
                            type="text"
                            value={orderState.details?.id ?? ""}
                        />
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
                        <Input
                            label="Total Price"
                            type="text"
                            value={currencyFormatter.format(orderState.details?.totalPrice ?? 0)}
                        />
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
                                <TableColumn key="id">ID</TableColumn>
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