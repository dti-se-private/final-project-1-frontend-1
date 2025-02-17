"use client"
import React, {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
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
import {useParams, useRouter} from "next/navigation";
import {useModal} from "@/src/hooks/useModal";
import {useOrder} from "@/src/hooks/useOrder";
import {ManualPaymentProcessRequest, orderApi, PaymentProofResponse} from "@/src/stores/apis/orderApi";
import Image from "next/image";
import {convertFileToHexString, convertHexStringToBase64Data} from "@/src/tools/converterTool";

export default function Page() {
    const {orderId}: { orderId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const {
        orderState,
        setDetails,
        processCancellation,
        processPaymentGateway,
        processManualPayment,
        processShipmentConfirmation
    } = useOrder();

    const [files, setFiles] = useState<File[]>([]);

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

    const rowMapper = (item: PaymentProofResponse, key: string): React.JSX.Element => {
        if (key === "file") {
            if (["jpg", "jpeg", "png"].includes(item.extension)) {
                return (
                    <div className="relative w-[10rem] h-[10rem] mb-4">
                        <Image
                            className="rounded-md"
                            src={
                                item.file
                                    ? convertHexStringToBase64Data(item.file, `image/${item.extension}`)
                                    : "https://placehold.co/400x400?text=proof"
                            }
                            layout="fill"
                            objectFit="cover"
                            alt='proof'
                        />
                    </div>
                );
            } else {
                return (
                    <></>
                );
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
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <div className="mb-8 text-4xl font-bold">Payment Proofs</div>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input name="image" type="file" multiple={true}
                                       onChange={async (event) => {
                                           const files = event.target.files;
                                           if (files) {
                                               setFiles([...files]);
                                           }
                                       }}
                                />
                                <Button
                                    isDisabled={orderState.details?.statuses[orderState.details?.statuses.length - 1].status !== "WAITING_FOR_PAYMENT"}
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    onPress={async () => {
                                        const request: ManualPaymentProcessRequest = {
                                            orderId: orderState.details!.id!,
                                            paymentProofs: []
                                        }

                                        if (files.length === 0) {
                                            modal.setContent({
                                                header: "Invalid File",
                                                body: `No file selected.`,
                                            });
                                            modal.onOpenChange(true);
                                            return;
                                        }

                                        for (const file of files) {
                                            const extension = file.name.split('.').pop();
                                            if (!extension) {
                                                modal.setContent({
                                                    header: "Invalid File",
                                                    body: `File ${file.name} has no extension.`,
                                                });
                                                modal.onOpenChange(true);
                                                return;
                                            }
                                            if (!["jpg", "jpeg", "png"].includes(extension)) {
                                                modal.setContent({
                                                    header: "Invalid File",
                                                    body: `Only jpg, jpeg, and png files are allowed.`,
                                                });
                                                modal.onOpenChange(true);
                                                return;
                                            }

                                            const hexString = await convertFileToHexString(file);

                                            const paymentProof = {
                                                extension: extension,
                                                file: hexString
                                            }
                                            request.paymentProofs.push(paymentProof);
                                        }

                                        processManualPayment(request)
                                            .then((data) => {
                                                modal.setContent({
                                                    header: "Manual Payment Succeed",
                                                    body: `${data.message}`,
                                                })
                                            })
                                            .catch((error) => {
                                                modal.setContent({
                                                    header: "Manual Payment Failed",
                                                    body: `${error.data.message}`,
                                                })
                                            })
                                            .finally(() => {
                                                modal.onOpenChange(true);
                                                detailOrderApiResult.refetch();
                                            });
                                    }}
                                    color="success"
                                    className="text-white"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="file">File</TableColumn>
                        <TableColumn key="extension">Extension</TableColumn>
                        <TableColumn key="time">Time</TableColumn>
                    </TableHeader>
                    <TableBody
                        emptyContent={"Empty!"}
                    >
                        {(orderState.details?.paymentProofs ?? []).map((item) =>
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