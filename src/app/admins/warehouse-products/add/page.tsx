"use client"
import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner} from "@heroui/react";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useWarehouseProduct} from "@/src/hooks/useWarehouseProduct";
import {useProduct} from "@/src/hooks/useProduct";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {WarehouseProductRequest} from "@/src/stores/apis/warehouseProductApi";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseProductState,
        addWarehouseProduct,
        getWarehouseProductsApiResult,
        setGetWarehouseProductsRequest
    } = useWarehouseProduct();
    const {productState, setGetProductsRequest, getProductsApiResult} = useProduct();
    const {warehouseState, setGetWarehousesRequest, getWarehousesApiResult} = useWarehouse();

    const initialValues = {
        productId: "",
        warehouseId: "",
        quantity: 0,
    };

    const validationSchema = Yup.object().shape({
        productId: Yup.string().required("Product ID is required."),
        warehouseId: Yup.string().required("Warehouse ID is required."),
        quantity: Yup.number().required("Quantity is required."),
    });

    const handleSubmit = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: WarehouseProductRequest = {
            productId: values.productId,
            warehouseId: values.warehouseId,
            quantity: values.quantity,
        }
        return addWarehouseProduct(request)
            .then((data) => {
                modal.setContent({
                    header: "Add Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Add Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    useEffect(() => {
        setGetProductsRequest({
            size: productState.getProductsRequest.size,
            page: productState.getProductsRequest.page,
            search: "",
        });
        setGetWarehousesRequest({
            size: warehouseState.getWarehousesRequest.size,
            page: warehouseState.getWarehousesRequest.page,
            search: "",
        });
    }, []);

    if (getProductsApiResult.isLoading || getWarehousesApiResult.isLoading) {
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
                <h1 className="text-center mb-8 text-4xl font-bold">Add Warehouse Product</h1>
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
                    />
                    <Button type="submit" className="w-full mt-4">
                        Add
                    </Button>
                </form>
            </div>
        </div>
    )
}