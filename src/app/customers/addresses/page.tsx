'use client'

import Link from 'next/link';
import React, {useEffect, useState} from "react";
import {useAccountAddress} from "@/src/hooks/useAccountAddress";
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
import {AccountAddressResponse} from "@/src/stores/apis/accountAddressApi";
import {useRouter} from "next/navigation";
import * as wkx from "wkx";
import {SearchIcon} from "@heroui/shared-icons";
import {useModal} from "@/src/hooks/useModal";
import {useDeleteConfirmation} from "@/src/hooks/useDeleteConfirmation";
import ConfirmationModal from "@/src/components/ConfirmationModal";

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        accountAddressState,
        getAccountAddressesApiResult,
        setGetAccountAddressesRequest,
        setDetails,
        deleteAccountAddress,
    } = useAccountAddress();

    useEffect(() => {
        setGetAccountAddressesRequest({
            page: accountAddressState.getAccountAddressesRequest.page,
            size: accountAddressState.getAccountAddressesRequest.size,
            search: "",
        });
    }, [])

    const [accountAddressToDelete, setAccountAddressToDelete] = useState<AccountAddressResponse | null>(null);
    const {
        isModalOpen,
        modalContent,
        showModal,
        handleConfirm,
        handleCancel,
        setModalContent,
    } = useDeleteConfirmation(() => {
        if (accountAddressToDelete) {
            deleteAccountAddress({id: accountAddressToDelete.id})
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
                    setAccountAddressToDelete(null);
                })
        }
    });


    const rowMapper = (item: AccountAddressResponse, key: string): React.JSX.Element => {
        if (key === "action") {
            return (
                <div className="flex flex-row gap-2">
                    <Button
                        color="primary"
                        as={Link}
                        href={`/customers/addresses/${item.id}`}
                    >
                        Details
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => {
                            setAccountAddressToDelete(item);
                            showModal("Confirm Delete", `Are you sure you want to delete the address "${item.name}"?`);
                        }}
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
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-start items-center w-3/4 min-h-[55vh]">
                <div className="mb-8 text-4xl font-bold">Addresses</div>
                <Table
                    topContent={
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row w-full gap-4">
                                <Input
                                    placeholder="Type to search..."
                                    startContent={<SearchIcon className="text-default-300"/>}
                                    value={accountAddressState.getAccountAddressesRequest.search}
                                    variant="bordered"
                                    isClearable={true}
                                    onClear={() => setGetAccountAddressesRequest({
                                        page: accountAddressState.getAccountAddressesRequest.page,
                                        size: accountAddressState.getAccountAddressesRequest.size,
                                        search: "",
                                    })}
                                    onValueChange={(value) => setGetAccountAddressesRequest({
                                        page: accountAddressState.getAccountAddressesRequest.page,
                                        size: accountAddressState.getAccountAddressesRequest.size,
                                        search: value
                                    })}
                                />
                                <Button
                                    startContent={<Icon icon="heroicons:plus"/>}
                                    as={Link}
                                    href={`/customers/addresses/add`}
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
                                    onChange={(event) => setGetAccountAddressesRequest({
                                        page: accountAddressState.getAccountAddressesRequest.page,
                                        size: Number(event.target.value),
                                        search: accountAddressState.getAccountAddressesRequest.search
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
                                page={accountAddressState.getAccountAddressesRequest.page + 1}
                                total={Infinity}
                                onChange={(page) => setGetAccountAddressesRequest({
                                    page: page - 1,
                                    size: accountAddressState.getAccountAddressesRequest.size,
                                    search: accountAddressState.getAccountAddressesRequest.search,
                                })}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn key="id">ID</TableColumn>
                        <TableColumn key="name">Name</TableColumn>
                        <TableColumn key="address">Address</TableColumn>
                        <TableColumn key="location">Location</TableColumn>
                        <TableColumn key="isPrimary">Is Primary</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={getAccountAddressesApiResult.data?.data ?? []}
                        loadingContent={<Spinner/>}
                        loadingState={getAccountAddressesApiResult.isFetching ? "loading" : "idle"}
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