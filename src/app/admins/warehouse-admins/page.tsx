"use client"
import React from "react";
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
import _ from "lodash";
import {useModal} from "@/src/hooks/useModal";

export default function WarehouseAdminsManagementPage() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseAdminState,
        getWarehouseAdminsApiResult,
        setGetWarehouseAdminsRequest,
        deleteWarehouseAdmin,
    } = useWarehouseAdmin();

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
                        onPress={() => deleteWarehouseAdmin({id: item.id})
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

        return (
            <>
                {String(getKeyValue(item, key))}
            </>
        );
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <h1 className="mb-8 text-4xl font-bold">Warehouse Admins</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseAdminState.getWarehouseAdminRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetWarehouseAdminsRequest({
                                        page: warehouseAdminState.getWarehouseAdminRequest.page,
                                        size: warehouseAdminState.getWarehouseAdminRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={_.debounce((value) => setGetWarehouseAdminsRequest({
                                        page: warehouseAdminState.getWarehouseAdminRequest.page,
                                        size: warehouseAdminState.getWarehouseAdminRequest.size,
                                        search: value
                                    }), 500)}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
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
                                        page: warehouseAdminState.getWarehouseAdminRequest.page,
                                        size: Number(event.target.value),
                                        search: warehouseAdminState.getWarehouseAdminRequest.search
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
                                page={warehouseAdminState.getWarehouseAdminRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetWarehouseAdminsRequest({
                                    page: page - 1,
                                    size: warehouseAdminState.getWarehouseAdminRequest.size,
                                    search: warehouseAdminState.getWarehouseAdminRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="rowNumber">#</TableColumn>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="accountId">Account ID</TableColumn>
                        <TableColumn key="warehouseId">Warehouse ID</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehouseAdminsApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehouseAdminsApiResult.isLoading ? "loading" : "idle"}
                    >
                        {
                            (item: WarehouseAdminResponse) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{getWarehouseAdminsApiResult.data?.data?.indexOf(item) ? getWarehouseAdminsApiResult.data?.data?.indexOf(item) + 1 : 0 + 1}</TableCell>
                                    <TableCell>{item?.id}</TableCell>
                                    <TableCell>{item?.accountId}</TableCell>
                                    <TableCell>{item?.warehouseId}</TableCell>
                                    <TableCell>{rowMapper(item, "action")}</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}