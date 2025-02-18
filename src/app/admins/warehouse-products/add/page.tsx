"use client"
import * as Yup from "yup";
import { useFormik } from "formik";
import { Autocomplete, AutocompleteItem, Button, Input, Spinner, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useWarehouseProduct } from "@/src/hooks/useWarehouseProduct";
import { useRouter } from "next/navigation";
import { WarehouseProductRequest, WarehouseProductResponse } from "@/src/stores/apis/warehouseProductApi";
import { useProduct } from "@/src/hooks/useProduct";
import { useWarehouse } from "@/src/hooks/useWarehouse";

interface ExistingPair {
    id: string;
    product: { id: string };
    warehouse: { id: string };
    quantity: number;
}

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [existingPair, setExistingPair] = useState<ExistingPair | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [warehouseProducts, setWarehouseProducts] = useState<WarehouseProductResponse[]>([]);
    const {
        warehouseProductState,
        addWarehouseProduct,
        getWarehouseProductsApiResult,
        setGetWarehouseProductsRequest,
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
        const existing = warehouseProducts.find(
            (item) => item.product.id === values.productId && item.warehouse.id === values.warehouseId
        );

        console.log("WarehouseProduct Data: ", warehouseProducts)
        console.log("Existing pair: ", existing)

        if (existing) {
            setExistingPair(existing);
            setIsModalOpen(true);
            actions.setSubmitting(false);
        } else {
            await addProduct(values, actions);
        }
    };

    const confirmAddProduct = async () => {
        if (existingPair) {
            await addProduct(formik.values, formik);
            setExistingPair(null);
            setIsModalOpen(false);
        }
    };

    const addProduct = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: WarehouseProductRequest = {
            productId: values.productId,
            warehouseId: values.warehouseId,
            quantity: values.quantity,
        }
        return addWarehouseProduct(request)
            .then((data) => {
                setIsModalOpen(false);
                router.push("/admins/warehouse-products");
            })
            .catch((error) => {
                setIsModalOpen(false);
            }).finally(() => {
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
        setGetWarehouseProductsRequest({
            size: warehouseProductState.getWarehouseProductsRequest.size,
            page: warehouseProductState.getWarehouseProductsRequest.page,
            search: "",
        });
    }, []);

    useEffect(() => {
        if (getWarehouseProductsApiResult.data?.data) {
            setWarehouseProducts(getWarehouseProductsApiResult.data.data);
        }
    }, [getWarehouseProductsApiResult.data]);

    if (isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Add Warehouse Product</h1>
                <form className="w-2/3 md:w-1/3" onSubmit={formik.handleSubmit}>
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
            {existingPair && (
                <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="lg">
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            This Pair is Existed, Check table below
                        </ModalHeader>
                        <ModalBody>
                            <Table>
                                <TableHeader>
                                    <TableColumn key="product.id">Product ID</TableColumn>
                                    <TableColumn key="warehouse.id">Warehouse ID</TableColumn>
                                    <TableColumn key="quantity">Quantity</TableColumn>
                                    <TableColumn key="action">Action</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key={existingPair.id}>
                                        <TableCell>{existingPair.product.id}</TableCell>
                                        <TableCell>{existingPair.warehouse.id}</TableCell>
                                        <TableCell>{existingPair.quantity}</TableCell>
                                        <TableCell>
                                            <Button color="primary" onClick={() => router.push(`/admins/warehouse-products/${existingPair.id}`)}>
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex justify-end mt-4">
                                <Button color="success" onClick={confirmAddProduct} className="text-white">Confirm</Button>
                                <Button color="danger" onClick={() => setIsModalOpen(false)} className="ml-2">Cancel</Button>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </div>
    )
}