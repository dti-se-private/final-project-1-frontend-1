"use client"
import React from "react";
import {useProduct} from "@/src/hooks/useProduct";
import {Icon} from "@iconify/react";
import {
    Button,
    getKeyValue,
    Image,
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
import _ from "lodash";
import {useModal} from "@/src/hooks/useModal";
import {SearchIcon} from "@heroui/shared-icons";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        productState,
        getProductsApiResult,
        setGetProductsRequest,
        deleteProduct,
    } = useProduct();

    const rowMapper = (item: ProductResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/products/${item.id}`)}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => deleteProduct({id: item.id})
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
                            }).finally(() => {
                                modal.onOpenChange(true);
                            })
                        }
                    >
                        Delete
                    </Button>
                </div>
            );
        }

        if (key === "image") {
            return (
                <Image
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                />
            );
        }

        if (key === "category") {
            return <>{item.category.name}</>;
        }

        return <>{String(getKeyValue(item, key))}</>;
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Products</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={productState.getProductsRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetProductsRequest({
                                        page: productState.getProductsRequest.page,
                                        size: productState.getProductsRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={_.debounce((value) => setGetProductsRequest({
                                        page: productState.getProductsRequest.page,
                                        size: productState.getProductsRequest.size,
                                        search: value
                                    }), 500)}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    onPress={() => router.push(`/products/add`)}
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
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
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
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="description">Description</TableColumn>
                        <TableColumn key="price">Price</TableColumn>
                        <TableColumn key="image">Image</TableColumn>
                        <TableColumn key="category">Category</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getProductsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getProductsApiResult.isLoading ? "loading" : "idle"}
                    >
                        {(item) => (
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