"use client"
import * as Yup from "yup";
import { useFormik } from "formik";
import { Autocomplete, AutocompleteItem, Button, Input, Spinner, Modal, ModalBody, ModalContent, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useWarehouseAdmin } from "@/src/hooks/useWarehouseAdmin";
import { useRouter } from "next/navigation";
import { WarehouseAdminRequest, WarehouseAdminResponse } from "@/src/stores/apis/warehouseAdminApi";
import { useWarehouse } from "@/src/hooks/useWarehouse";
import { accountApi } from "@/src/stores/apis/accountApi";

interface ExistingPair {
    id: string;
    warehouseId: string;
    accountId: string;
}

export default function Page() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [existingPair, setExistingPair] = useState<ExistingPair | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [warehouseAdmins, setWarehouseAdmins] = useState<WarehouseAdminResponse[]>([]);
    const {
        warehouseAdminState,
        addWarehouseAdmin,
        getWarehouseAdminsApiResult,
        setGetWarehouseAdminsRequest,
    } = useWarehouseAdmin();
    const {
        warehouseState,
        setGetWarehousesRequest,
        getWarehousesApiResult,
    } = useWarehouse();
    const { data: adminData } = accountApi.useGetAdminsQuery();

    const initialValues = {
        warehouseId: "",
        accountId: "",
    };

    const validationSchema = Yup.object().shape({
        warehouseId: Yup.string().required("Warehouse ID is required."),
        accountId: Yup.string().required("Account ID is required."),
    });

    const handleSubmit = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const existing = warehouseAdmins.find(
            (item) => item.warehouseId === values.warehouseId && item.accountId === values.accountId
        );

        if (existing) {
            setExistingPair(existing);
            setIsModalOpen(true);
            actions.setSubmitting(false);
        } else {
            await addAdmin(values, actions);
        }
    };

    const addAdmin = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: WarehouseAdminRequest = {
            warehouseId: values.warehouseId,
            accountId: values.accountId,
        }
        return addWarehouseAdmin(request)
            .then((data) => {
                setIsModalOpen(false);
                router.push("/admin/warehouse-admins");
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
        setGetWarehousesRequest({
            size: warehouseState.getWarehousesRequest.size,
            page: warehouseState.getWarehousesRequest.page,
            search: "",
        });
        setGetWarehouseAdminsRequest({
            size: warehouseAdminState.getWarehouseAdminRequest.size,
            page: warehouseAdminState.getWarehouseAdminRequest.page,
            search: "",
        });
    }, []);

    useEffect(() => {
        if (getWarehouseAdminsApiResult.data?.data) {
            setWarehouseAdmins(getWarehouseAdminsApiResult.data.data);
        }
    }, [getWarehouseAdminsApiResult.data]);

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
                <h1 className="mb-8 text-4xl font-bold">Add Warehouse Admin</h1>
                <form className="w-2/3 md:w-1/3" onSubmit={formik.handleSubmit}>
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
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Admin"
                        name="accountId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.accountId}
                        errorMessage={formik.errors.accountId}
                        isInvalid={Boolean(formik.errors.accountId)}
                        items={adminData?.data ?? []}
                        onSelectionChange={(key) => formik.setFieldValue("accountId", key)}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {`${item.id} - ${item.name}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
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
                                    <TableColumn key="warehouseId">Warehouse ID</TableColumn>
                                    <TableColumn key="accountId">Account ID</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key={existingPair.id}>
                                        <TableCell>{existingPair.warehouseId}</TableCell>
                                        <TableCell>{existingPair.accountId}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <div className="flex justify-end mt-4">
                                <Button onClick={() => setIsModalOpen(false)} className="ml-2">Close</Button>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </div>
    )
}