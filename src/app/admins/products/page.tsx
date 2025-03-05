'use client'

import Link from 'next/link';
import React, {useEffect, useState} from "react";
import {useProduct} from "@/src/hooks/useProduct";
import {Icon} from "@iconify/react";
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
import {ProductResponse} from "@/src/stores/apis/productApi";
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import {useDeleteConfirmation} from "@/src/hooks/useDeleteConfirmation";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
    const {
        productState,
        getProductsApiResult,
        setGetProductsRequest,
        setDetails,
        deleteProduct,
    } = useProduct();

    const {
        isModalOpen,
        modalContent,
        showModal,
        handleConfirm,
        handleCancel,
        setModalContent,
    } = useDeleteConfirmation(() => {
        if (productToDelete) {
            deleteProduct({id: productToDelete.id})
                .then((data) => {
                    modal.setContent({
                        header: "Delete Succeed",
                        body: `${data.message}`,
                    })
                })
                .catch((error) => {
                    modal.setContent({
                        header: "Delete Failed",
                        body: `${error.data.message}`,
                    })
                })
                .finally(() => {
                    modal.onOpenChange(true);
                    setProductToDelete(null);
                });
        }
    });

    const handleDelete = (product: ProductResponse) => {
        setProductToDelete(product);
        showModal("Confirm Delete", `Are you sure you want to delete the product "${product.name}"?`);
    }

    useEffect(() => {
        setGetProductsRequest({
            page: productState.getProductsRequest.page,
            size: productState.getProductsRequest.size,
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

    const rowMapper = (item: ProductResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-col gap-2">
                    <Button
                        color="primary"
                        as={Link}
                        href={`/admins/products/${item.id}`}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => handleDelete(item)}
                    >
                        Delete
                    </Button>
                </div>
            );
        } else if (key === "category") {
            return (
                <>
                    {item.category?.name}
                </>
            );
        } else if (key === "price") {
            return (
                <>
                    {currencyFormatter.format(item.price)}
                </>
            );
        } else if (key === "image") {
            return (
                <div className="relative w-[10rem] h-[10rem] mb-4">
                    <Image
                        className="rounded-md"
                        src={
                            item.image
                                ? convertHexStringToBase64Data(item.image, "image/png")
                                : "https://placehold.co/400x400?text=product"
                        }
                        layout="fill"
                        objectFit="cover"
                        alt='product'
                    />
                </div>
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
                <div className="mb-8 text-4xl font-bold">Products</div>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={productState.getProductsRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetProductsRequest({
                                        page: productState.getProductsRequest.page,
                                        size: productState.getProductsRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetProductsRequest({
                                        page: productState.getProductsRequest.page,
                                        size: productState.getProductsRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    as={Link}
                                    href={`/admins/products/add`}
                                    color="success"
                                    className="text-white"
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetProductsRequest({
                                        page: productState.getProductsRequest.page,
                                        size: Number(event.target.value),
                                        search: productState.getProductsRequest.search
                                    })}
                                    defaultValue={10}
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
                                page={productState.getProductsRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetProductsRequest({
                                    page: page - 1,
                                    size: productState.getProductsRequest.size,
                                    search: productState.getProductsRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="category">Category Name</TableColumn>
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="price">Price</TableColumn>
                        <TableColumn key="quantity">Quantity</TableColumn>
                        <TableColumn key="image">Image</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getProductsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getProductsApiResult.isFetching ? "loading" : "idle"}
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

            <ConfirmationModal
                isOpen={isModalOpen}
                header={modalContent.header}
                body={modalContent.body}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </div>
    )
}