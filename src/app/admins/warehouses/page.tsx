"use client"
import React, {useEffect} from "react";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";
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
import {useModal} from "@/src/hooks/useModal";
import wkx from "wkx";

export default function WarehouseManagementPage() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseState,
        getWarehousesApiResult,
        setGetWarehousesRequest,
        deleteWarehouse,
    } = useWarehouse();

    useEffect(() => {
        setGetWarehousesRequest({
            page: warehouseState.getWarehousesRequest.page,
            size: warehouseState.getWarehousesRequest.size,
            search: "",
        });
    }, [])

    const rowMapper = (item: WarehouseResponse, key: string) => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        onPress={() => router.push(`/admins/warehouses/${item.id}`)}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => deleteWarehouse({id: item.id})
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

        if (key === "location") {
            const wkbBuffer = Buffer.from(item.location, 'hex')
            const geometry = wkx.Geometry.parse(wkbBuffer);
            const geoJson = geometry.toGeoJSON() as { type: string, coordinates: number[] }
            const mapLink = `https://maps.google.com/?q=${geoJson.coordinates[1]},${geoJson.coordinates[0]}`
            return (
                <Button
                    onPress={() => window.open(mapLink)}
                >
                    <Icon icon="heroicons:map-pin"/>
                </Button>
            )
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
                <h1 className="mb-8 text-4xl font-bold">Warehouses</h1>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={warehouseState.getWarehousesRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetWarehousesRequest({
                                        page: warehouseState.getWarehousesRequest.page,
                                        size: warehouseState.getWarehousesRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetWarehousesRequest({
                                        page: warehouseState.getWarehousesRequest.page,
                                        size: warehouseState.getWarehousesRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    color="success"
                                    className={"text-white"}
                                    onPress={() => router.push(`/admins/warehouses/add`)}
                                >
                                    Add
                                </Button>
                            </div>
                            <label className="flex items-center text-default-400 text-small">
                                Rows per page:
                                <select
                                    className="bg-transparent outline-none text-default-400 text-small"
                                    onChange={(event) => setGetWarehousesRequest({
                                        page: warehouseState.getWarehousesRequest.page,
                                        size: Number(event.target.value),
                                        search: warehouseState.getWarehousesRequest.search
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
                                page={warehouseState.getWarehousesRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetWarehousesRequest({
                                    page: page - 1,
                                    size: warehouseState.getWarehousesRequest.size,
                                    search: warehouseState.getWarehousesRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="rowNumber">#</TableColumn>
                        <TableColumn key="id">Warehouse ID</TableColumn>
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="description">Description</TableColumn>
                        <TableColumn key="location">Location</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getWarehousesApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getWarehousesApiResult.isFetching ? "loading" : "idle"}
                    >
                        {
                            (item: WarehouseResponse) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{getWarehousesApiResult.data?.data?.indexOf(item) ? getWarehousesApiResult.data?.data?.indexOf(item) + 1 : 0 + 1}</TableCell>
                                    <TableCell>{item?.id}</TableCell>
                                    <TableCell>{item?.name}</TableCell>
                                    <TableCell>{item?.description}</TableCell>
                                    <TableCell>{rowMapper(item, "location")}</TableCell>
                                    <TableCell>{rowMapper(item, "action")}</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}