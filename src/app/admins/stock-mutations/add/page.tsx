'use client'

import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner} from "@heroui/react";
import React, {useEffect} from "react";
import {useProduct} from "@/src/hooks/useProduct";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {useModal} from "@/src/hooks/useModal";
import {useWarehouseLedger} from "@/src/hooks/useWarehouseLedger";
import {AddMutationRequest} from "@/src/stores/apis/warehouseLedgerApi";

export default function Page() {
    const modal = useModal();
    const {productState, setGetProductsRequest, getProductsApiResult} = useProduct();
    const {
        warehouseState,
        setGetOriginWarehousesRequest,
        setGetDestinationWarehousesRequest,
        getOriginWarehousesApiResult,
        getDestinationWarehousesApiResult
    } = useWarehouse();

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
        setGetProductsRequest({
            size: productState.getProductsRequest.size,
            page: productState.getProductsRequest.page,
            search: ""
        });
        setGetOriginWarehousesRequest({
            size: warehouseState.getOriginWarehousesRequest.size,
            page: warehouseState.getOriginWarehousesRequest.page,
            search: ""
        });
        setGetDestinationWarehousesRequest({
            size: warehouseState.getDestinationWarehousesRequest.size,
            page: warehouseState.getDestinationWarehousesRequest.page,
            search: ""
        });
    }, []);

    const initialValues = {
        productId: "",
        originWarehouseId: "",
        destinationWarehouseId: "",
        quantity: 0,
    };

    const validationSchema = Yup.object().shape({
        productId: Yup.string().required("Product ID is required."),
        originWarehouseId: Yup.string().required("Origin Warehouse ID is required."),
        destinationWarehouseId: Yup.string().required("Destination Warehouse ID is required."),
        quantity: Yup.number().required("Quantity is required.").min(1, "Quantity must be at least 1."),
    });

    const handleSubmit = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: AddMutationRequest = {
            productId: values.productId,
            originWarehouseId: values.originWarehouseId,
            destinationWarehouseId: values.destinationWarehouseId,
            quantity: values.quantity
        }
        addMutationRequest(request)
            .then((data) => {
                modal
                    .setContent({
                        header: "Add Succeed",
                        body: `${data.message}`
                    });
            })
            .catch((error) => {
                modal
                    .setContent({
                        header: "Add Failed",
                        body: `${error.data.message}`
                    });
            })
            .finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    if (getProductsApiResult.isLoading || getOriginWarehousesApiResult.isLoading || getDestinationWarehousesApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Add Stock Mutation</h1>
                <form className="w-2/3 md:w-2/3" onSubmit={formik.handleSubmit}>
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Product ID"
                        name="productId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.productId}
                        errorMessage={formik.errors.productId}
                        isInvalid={Boolean(formik.errors.productId)}
                        inputValue={productState.getProductsRequest.search}
                        isLoading={getProductsApiResult.isFetching}
                        items={getProductsApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetProductsRequest({
                                size: productState.getProductsRequest.size,
                                page: productState.getProductsRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("productId", key);
                            const item = getProductsApiResult.data?.data?.find((item) => item.id === key);
                            setGetProductsRequest({
                                size: productState.getProductsRequest.size,
                                page: productState.getProductsRequest.page,
                                search: `${item?.id} - ${item?.name}`,
                            });
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {`${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Origin Warehouse ID"
                        name="originWarehouseId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.originWarehouseId}
                        errorMessage={formik.errors.originWarehouseId}
                        isInvalid={Boolean(formik.errors.originWarehouseId)}
                        inputValue={warehouseState.getOriginWarehousesRequest.search}
                        isLoading={getOriginWarehousesApiResult.isFetching}
                        items={getOriginWarehousesApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetOriginWarehousesRequest({
                                size: warehouseState.getOriginWarehousesRequest.size,
                                page: warehouseState.getOriginWarehousesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("originWarehouseId", key);
                            const item = getOriginWarehousesApiResult.data?.data?.find((item) => item.id === key);
                            setGetOriginWarehousesRequest({
                                size: warehouseState.getOriginWarehousesRequest.size,
                                page: warehouseState.getOriginWarehousesRequest.page,
                                search: `${item?.id} - ${item?.name}`,
                            });
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {`${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Destination Warehouse ID"
                        name="destinationWarehouseId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.destinationWarehouseId}
                        errorMessage={formik.errors.destinationWarehouseId}
                        isInvalid={Boolean(formik.errors.destinationWarehouseId)}
                        inputValue={warehouseState.getDestinationWarehousesRequest.search}
                        isLoading={getDestinationWarehousesApiResult.isFetching}
                        items={getDestinationWarehousesApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetDestinationWarehousesRequest({
                                size: warehouseState.getDestinationWarehousesRequest.size,
                                page: warehouseState.getDestinationWarehousesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("destinationWarehouseId", key);
                            const item = getDestinationWarehousesApiResult.data?.data?.find((item) => item.id === key);
                            setGetDestinationWarehousesRequest({
                                size: warehouseState.getDestinationWarehousesRequest.size,
                                page: warehouseState.getDestinationWarehousesRequest.page,
                                search: `${item?.id} - ${item?.name}`,
                            });
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {`${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <Input
                        className="mb-6 w-full"
                        name="quantity"
                        label="Quantity"
                        type="number"
                        value={`${formik.values.quantity}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.quantity)}
                        errorMessage={formik.errors.quantity}
                        disabled={formik.isSubmitting}
                    />
                    <Button type="submit" className="w-full mt-4">
                        Add
                    </Button>
                </form>
            </div>
        </div>
    );
}