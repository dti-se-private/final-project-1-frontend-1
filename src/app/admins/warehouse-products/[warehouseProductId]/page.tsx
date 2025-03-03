'use client'

import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect, useState} from "react";
import {useWarehouseProduct} from "@/src/hooks/useWarehouseProduct";
import {useParams, useRouter} from "next/navigation";
import {PatchWarehouseProductRequest, warehouseProductApi} from "@/src/stores/apis/warehouseProductApi";
import {useProduct} from "@/src/hooks/useProduct";
import {useWarehouse} from "@/src/hooks/useWarehouse";

export default function Page() {
    const {warehouseProductId}: { warehouseProductId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const {
        warehouseProductState,
        patchWarehouseProduct,
        setDetails
    } = useWarehouseProduct();
    const {
        productState,
        setGetProductsRequest,
        getProductsApiResult,
    } = useProduct();
    const {
        warehouseState,
        setGetWarehousesRequest,
        getWarehousesApiResult,
    } = useWarehouse();

    const detailWarehouseProductApiResult = warehouseProductApi.useGetWarehouseProductQuery({
        id: warehouseProductId,
    });

    const initialValues = {
        id: warehouseProductState.details?.id ?? "",
        productId: warehouseProductState.details?.product.id ?? "",
        warehouseId: warehouseProductState.details?.warehouse.id ?? "",
        quantity: warehouseProductState.details?.quantity ?? 0,
    };

    useEffect(() => {
        if (detailWarehouseProductApiResult.data?.data) {
            setDetails(detailWarehouseProductApiResult.data.data);
            setIsLoading(false);
        }
    }, [detailWarehouseProductApiResult.data?.data]);

    const validationSchema = Yup.object().shape({
        productId: Yup.string().required("Product ID is required."),
        warehouseId: Yup.string().required("Warehouse ID is required."),
        quantity: Yup.number().required("Quantity is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchWarehouseProductRequest = {
            id: values.id,
            data: {
                productId: values.productId,
                warehouseId: values.warehouseId,
                quantity: values.quantity,
            }
        }
        return patchWarehouseProduct(request)
            .then((data) => {
                modal.setContent({
                    header: "Update Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Update Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    const formik = useFormik(({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    }))

    useEffect(() => {
        if (warehouseProductState.details) {
            setGetProductsRequest({
                size: productState.getProductsRequest.size,
                page: productState.getProductsRequest.page,
                search: `${warehouseProductState.details.product.id} - ${warehouseProductState.details.product.name}`,
            });
            setGetWarehousesRequest({
                size: warehouseState.getWarehousesRequest.size,
                page: warehouseState.getWarehousesRequest.page,
                search: `${warehouseProductState.details.warehouse.id} - ${warehouseProductState.details.warehouse.name}`,
            });
        }
    }, [warehouseProductState.details]);

    if (isLoading || detailWarehouseProductApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="text-center mb-8 text-4xl font-bold">Warehouse Product Details</h1>
                <form className="w-2/3 md:w-2/3" onSubmit={formik.handleSubmit}>
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Product"
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
                        label="Warehouse"
                        name="warehouseId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.warehouseId}
                        errorMessage={formik.errors.warehouseId}
                        isInvalid={Boolean(formik.errors.warehouseId)}
                        inputValue={warehouseState.getWarehousesRequest.search}
                        isLoading={getWarehousesApiResult.isFetching}
                        items={getWarehousesApiResult.data?.data ?? []}
                        isClearable={false}
                        onInputChange={(input) => {
                            setGetWarehousesRequest({
                                size: warehouseState.getWarehousesRequest.size,
                                page: warehouseState.getWarehousesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("warehouseId", key);
                            const item = getWarehousesApiResult.data?.data?.find((item) => item.id === key);
                            setGetWarehousesRequest({
                                size: warehouseState.getWarehousesRequest.size,
                                page: warehouseState.getWarehousesRequest.page,
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
                    >
                    </Input>
                    <Button type="submit" className="w-full mt-4">
                        Update
                    </Button>
                </form>
            </div>
        </div>
    )
}