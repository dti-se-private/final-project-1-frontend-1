"use client"
import React, {useEffect, useState} from "react";
import {useWarehouseAdmin} from "@/src/hooks/useWarehouseAdmin";
import {WarehouseAdminResponse} from "@/src/stores/apis/warehouseAdminApi";
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
import {useRouter} from "next/navigation";
import {SearchIcon} from "@heroui/shared-icons";
import ConfirmationModal from "@/src/components/ConfirmationModal";
import {useDeleteConfirmation} from "@/src/hooks/useDeleteConfirmation";


export default function WarehouseAdminsManagementPage() {
    const router = useRouter();
    const [adminToDelete, setAdminToDelete] = useState<WarehouseAdminResponse | null>(null);
    const {
        warehouseAdminState,
        getWarehouseAdminsApiResult,
        setGetWarehouseAdminsRequest,
        deleteWarehouseAdmin,
    } = useWarehouseAdmin();

    const {
        isModalOpen,
        modalContent,
        showModal,
        handleConfirm,
        handleCancel,
        setModalContent,
    } = useDeleteConfirmation(() => {
        if (adminToDelete) {
            deleteWarehouseAdmin({ id: adminToDelete.id })
                .then((data) => {
                    setModalContent({
                        header: "Delete Succeed",
                        body: `${data.message}`,
                    });
                })
                .catch((error) => {
                    setModalContent({
                        header: "Delete Failed",
                        body: `${error.data.message}`,
                    });
                })
                .finally(() => {
                    setAdminToDelete(null);
                });
        }
    });

    const handleDelete = (admin: WarehouseAdminResponse) => {
        setAdminToDelete(admin);
        showModal("Confirm Delete", `Are you sure you want to delete the admin "${admin.account.name}"?`);
    };

    useEffect(() => {
        setGetWarehouseAdminsRequest({
            page: warehouseAdminState.getWarehouseAdminsRequest.page,
            size: warehouseAdminState.getWarehouseAdminsRequest.size,
            search: "",
        });
    }, [])

    const rowMapper = (item: WarehouseAdminResponse, key: string) => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/admins/warehouse-admins/${item.id}`)}
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
        } else if (key === "accountId") {
            return (
                <>
                    {item.account.id}
                </>
            );
        } else if (key === "warehouseId") {
            return (
                <>
                    {item.warehouse.id}
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
                <h1 className="mb-8 text-4xl font-bold">Warehouse Admins</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseAdminState.getWarehouseAdminsRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetWarehouseAdminsRequest({
                                        page: warehouseAdminState.getWarehouseAdminsRequest.page,
                                        size: warehouseAdminState.getWarehouseAdminsRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetWarehouseAdminsRequest({
                                        page: warehouseAdminState.getWarehouseAdminsRequest.page,
                                        size: warehouseAdminState.getWarehouseAdminsRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    color="success"
                                    className={"text-white"}
                                    onPress={() => router.push(`/admins/warehouse-admins/add`)}
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetWarehouseAdminsRequest({
                                        page: warehouseAdminState.getWarehouseAdminsRequest.page,
                                        size: event.target.value,
                                        search: warehouseAdminState.getWarehouseAdminsRequest.search
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
                                page={warehouseAdminState.getWarehouseAdminsRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetWarehouseAdminsRequest({
                                    page: page - 1,
                                    size: warehouseAdminState.getWarehouseAdminsRequest.size,
                                    search: warehouseAdminState.getWarehouseAdminsRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="accountId">Account ID</TableColumn>
                        <TableColumn key="warehouseId">Warehouse ID</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehouseAdminsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehouseAdminsApiResult.isFetching ? "loading" : "idle"}
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