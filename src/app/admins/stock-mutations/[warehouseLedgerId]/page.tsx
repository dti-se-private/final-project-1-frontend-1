"use client"
import * as Yup from "yup";
import {useFormik} from "formik";
import {Input, Spinner} from "@heroui/react";
import React, {useEffect} from "react";
import {useModal} from "@/src/hooks/useModal";
import {useParams} from "next/navigation";
import {useWarehouseLedger} from "@/src/hooks/useWarehouseLedger";
import {warehouseLedgerApi} from "@/src/stores/apis/warehouseLedgerApi";
import moment from "moment/moment";

export default function Page() {
    const {warehouseLedgerId}: { warehouseLedgerId: string } = useParams();
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

    const detailStockMutationRequestApiResult = warehouseLedgerApi.useGetMutationRequestQuery({
        id: warehouseLedgerId,
    });

    const initialValues = {
        id: warehouseLedgerState.details?.id ?? "",
        productId: warehouseLedgerState.details?.originWarehouseProduct.product.id ?? "",
        productName: warehouseLedgerState.details?.originWarehouseProduct.product.name ?? "",
        originWarehouseId: warehouseLedgerState.details?.originWarehouseProduct.warehouse.id ?? "",
        originWarehouseName: warehouseLedgerState.details?.originWarehouseProduct.warehouse.name ?? "",
        destinationWarehouseId: warehouseLedgerState.details?.destinationWarehouseProduct.warehouse.id ?? "",
        destinationWarehouseName: warehouseLedgerState.details?.destinationWarehouseProduct.warehouse.name ?? "",
        originPreQuantity: warehouseLedgerState.details?.originPreQuantity ?? "",
        originPostQuantity: warehouseLedgerState.details?.originPostQuantity ?? "",
        originQuantity: (warehouseLedgerState.details?.originPreQuantity ?? 0) - (warehouseLedgerState.details?.originPostQuantity ?? 0),
        destinationPreQuantity: warehouseLedgerState.details?.destinationPreQuantity ?? "",
        destinationPostQuantity: warehouseLedgerState.details?.destinationPostQuantity ?? "",
        destinationQuantity: (warehouseLedgerState.details?.destinationPostQuantity ?? 0) - (warehouseLedgerState.details?.destinationPreQuantity ?? 0),
        status: warehouseLedgerState.details?.status ?? "",
        time: warehouseLedgerState.details?.time ?? "",
    };

    useEffect(() => {
        if (detailStockMutationRequestApiResult.data?.data) {
            setDetails(detailStockMutationRequestApiResult.data.data);
        }
    }, [detailStockMutationRequestApiResult.data?.data]);


    const validationSchema = Yup.object().shape({
        id: Yup.string().required("ID is required."),
        productId: Yup.string().required("Product ID is required."),
        productName: Yup.string().required("Product Name is required."),
        originWarehouseId: Yup.string().required("Origin Warehouse ID is required."),
        originWarehouseName: Yup.string().required("Origin Warehouse Name is required."),
        destinationWarehouseProductId: Yup.string().required("Destination Warehouse Product ID is required."),
        destinationWarehouseProductName: Yup.string().required("Destination Warehouse Product Name is required."),
        destinationWarehouseId: Yup.string().required("Destination Warehouse ID is required."),
        destinationWarehouseName: Yup.string().required("Destination Warehouse Name is required."),
        originPreQuantity: Yup.number().required("Origin Pre Quantity is required."),
        originPostQuantity: Yup.number().required("Origin Post Quantity is required."),
        originQuantity: Yup.number().required("Origin Quantity is required."),
        destinationPreQuantity: Yup.number().required("Destination Pre Quantity is required."),
        destinationPostQuantity: Yup.number().required("Destination Post Quantity is required."),
        destinationQuantity: Yup.number().required("Destination Quantity is required."),
        status: Yup.string().required("Status is required."),
        time: Yup.date().required("Time is required."),
    });


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
        },
        enableReinitialize: true,
    });

    if (detailStockMutationRequestApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Stock Mutation Details</h1>
                <form className="w-2/3 md:w-2/3" onSubmit={formik.handleSubmit}>
                    <Input
                        className="mb-6 w-full"
                        name="id"
                        label="ID"
                        type="text"
                        value={`${formik.values.id}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.id)}
                        errorMessage={formik.errors.id}
                        disabled={formik.isSubmitting}
                    />
                    <div className="flex gap-4">
                        <Input
                            className="mb-6 w-full"
                            name="productId"
                            label="Product ID"
                            type="text"
                            value={`${formik.values.productId}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.productId)}
                            errorMessage={formik.errors.productId}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="productName"
                            label="Product Name"
                            type="text"
                            value={`${formik.values.productName}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.productName)}
                            errorMessage={formik.errors.productName}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            className="mb-6 w-full"
                            name="originWarehouseId"
                            label="Origin Warehouse ID"
                            type="text"
                            value={`${formik.values.originWarehouseId}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.originWarehouseId)}
                            errorMessage={formik.errors.originWarehouseId}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="originWarehouseName"
                            label="Origin Warehouse Name"
                            type="text"
                            value={`${formik.values.originWarehouseName}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.originWarehouseName)}
                            errorMessage={formik.errors.originWarehouseName}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            className="mb-6 w-full"
                            name="destinationWarehouseId"
                            label="Destination Warehouse ID"
                            type="text"
                            value={`${formik.values.destinationWarehouseId}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.destinationWarehouseId)}
                            errorMessage={formik.errors.destinationWarehouseId}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="destinationWarehouseName"
                            label="Destination Warehouse Name"
                            type="text"
                            value={`${formik.values.destinationWarehouseName}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.destinationWarehouseName)}
                            errorMessage={formik.errors.destinationWarehouseName}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            className="mb-6 w-full"
                            name="originPreQuantity"
                            label="Origin Pre Quantity"
                            type="number"
                            value={`${formik.values.originPreQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.originPreQuantity)}
                            errorMessage={formik.errors.originPreQuantity}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="originPostQuantity"
                            label="Origin Post Quantity"
                            type="number"
                            value={`${formik.values.originPostQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.originPostQuantity)}
                            errorMessage={formik.errors.originPostQuantity}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="originQuantity"
                            label="Decreasing Origin Quantity"
                            type="number"
                            value={`${formik.values.originQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.originQuantity)}
                            errorMessage={formik.errors.originQuantity}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Input
                            className="mb-6 w-full"
                            name="destinationPreQuantity"
                            label="Destination Pre Quantity"
                            type="number"
                            value={`${formik.values.destinationPreQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.destinationPreQuantity)}
                            errorMessage={formik.errors.destinationPreQuantity}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="destinationPostQuantity"
                            label="Destination Post Quantity"
                            type="number"
                            value={`${formik.values.destinationPostQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.destinationPostQuantity)}
                            errorMessage={formik.errors.destinationPostQuantity}
                            disabled={formik.isSubmitting}
                        />
                        <Input
                            className="mb-6 w-full"
                            name="destinationQuantity"
                            label="Increasing Destination Quantity"
                            type="number"
                            value={`${formik.values.destinationQuantity}`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={Boolean(formik.errors.destinationQuantity)}
                            errorMessage={formik.errors.destinationQuantity}
                            disabled={formik.isSubmitting}
                        />
                    </div>
                    <Input
                        className="mb-6 w-full"
                        name="status"
                        label="Status"
                        type="text"
                        value={`${formik.values.status}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.status)}
                        errorMessage={formik.errors.status}
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        className="mb-6 w-full"
                        name="time"
                        label="Time"
                        type="datetime-local"
                        value={moment(formik.values.time).format("YYYY-MM-DDTHH:mm")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.time)}
                        errorMessage={formik.errors.time}
                        disabled={formik.isSubmitting}
                    />
                </form>
            </div>
        </div>
    );
}