"use client"
import * as Yup from "yup";
import { useFormik } from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useProduct } from "@/src/hooks/useProduct";
import { useWarehouse } from "@/src/hooks/useWarehouse";
import { useModal } from "@/src/hooks/useModal";

export default function Page() {
    const modal = useModal();
    const { productState, setGetProductsRequest, getProductsApiResult } = useProduct();
    const { warehouseState, setGetWarehousesRequest, getWarehousesApiResult } = useWarehouse();
    const [originSearch, setOriginSearch] = useState("");
    const [destinationSearch, setDestinationSearch] = useState("");

    useEffect(() => {
        setGetProductsRequest({ size: 10, page: 0, search: "" });
        setGetWarehousesRequest({ size: 10, page: 0, search: "" });
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
        // return addStockMutation(values)
        //     .then((data) => {
        //         modal.setContent({ header: "Add Succeed", body: `${data.message}` });
        //     })
        //     .catch((error) => {
        //         modal.setContent({ header: "Add Failed", body: `${error.data.message}` });
        //     })
        //     .finally(() => {
        //         modal.onOpenChange(true);
        //         actions.setSubmitting(false);
        //     });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    if (getProductsApiResult.isLoading || getWarehousesApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Add Stock Mutation</h1>
                <form className="w-2/3 md:w-1/3" onSubmit={formik.handleSubmit}>
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
                        inputValue={originSearch}
                        isLoading={getWarehousesApiResult.isFetching}
                        items={getWarehousesApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setOriginSearch(input);
                            setGetWarehousesRequest({
                                size: warehouseState.getWarehousesRequest.size,
                                page: warehouseState.getWarehousesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("originWarehouseId", key);
                            const item = getWarehousesApiResult.data?.data?.find((item) => item.id === key);
                            setOriginSearch(`${item?.id} - ${item?.name}`);
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
                        inputValue={destinationSearch}
                        isLoading={getWarehousesApiResult.isFetching}
                        items={getWarehousesApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setDestinationSearch(input);
                            setGetWarehousesRequest({
                                size: warehouseState.getWarehousesRequest.size,
                                page: warehouseState.getWarehousesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("destinationWarehouseId", key);
                            const item = getWarehousesApiResult.data?.data?.find((item) => item.id === key);
                            setDestinationSearch(`${item?.id} - ${item?.name}`);
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