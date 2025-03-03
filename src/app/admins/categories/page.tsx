"use client"
import React, {useEffect, useState} from "react";
import {useCategory} from "@/src/hooks/useCategory";
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
import {CategoryResponse} from "@/src/stores/apis/categoryApi";
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import {useDeleteConfirmation} from "@/src/hooks/useDeleteConfirmation";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);
    const {
        categoryState,
        getCategoriesApiResult,
        setGetCategoriesRequest,
        setDetails,
        deleteCategory,
    } = useCategory();

    const {
        isModalOpen,
        modalContent,
        showModal,
        handleConfirm,
        handleCancel,
        setModalContent,
    } = useDeleteConfirmation(() => {
        if (categoryToDelete) {
            deleteCategory({id: categoryToDelete.id})
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
                    setCategoryToDelete(null);
                });
        }
    });

    const handleDelete = (category: CategoryResponse) => {
        setCategoryToDelete(category);
        showModal("Confirm Delete", `Are you sure you want to delete the admin "${category.name}"?`);
    }

    useEffect(() => {
        setGetCategoriesRequest({
            page: categoryState.getCategoriesRequest.page,
            size: categoryState.getCategoriesRequest.size,
            search: "",
        });
    }, [])

    const rowMapper = (item: CategoryResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/admins/categories/${item.id}`)}
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
                <div className="mb-8 text-4xl font-bold">Categories</div>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={categoryState.getCategoriesRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetCategoriesRequest({
                                        page: categoryState.getCategoriesRequest.page,
                                        size: categoryState.getCategoriesRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetCategoriesRequest({
                                        page: categoryState.getCategoriesRequest.page,
                                        size: categoryState.getCategoriesRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    onPress={() => router.push(`/admins/categories/add`)}
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
                                    onChange={(event) => setGetCategoriesRequest({
                                        page: categoryState.getCategoriesRequest.page,
                                        size: Number(event.target.value),
                                        search: categoryState.getCategoriesRequest.search
                                    })}
                                    defaultValue={5}
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
                                page={categoryState.getCategoriesRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetCategoriesRequest({
                                    page: page - 1,
                                    size: categoryState.getCategoriesRequest.size,
                                    search: categoryState.getCategoriesRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="description">Description</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getCategoriesApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getCategoriesApiResult.isFetching ? "loading" : "idle"}
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