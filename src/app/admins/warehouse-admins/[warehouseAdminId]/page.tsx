"use client"
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@heroui/react";
import { useModal } from "@/src/hooks/useModal";
import React, { useEffect, useState } from "react";
import { useWarehouseAdmin } from "@/src/hooks/useWarehouseAdmin";
import { useParams, useRouter } from "next/navigation";
import { warehouseAdminApi, PatchWarehouseAdminRequest } from "@/src/stores/apis/warehouseAdminApi";
import { useWarehouse } from "@/src/hooks/useWarehouse";
import {accountApi, AccountResponse} from "@/src/stores/apis/accountApi";
import {WarehouseResponse} from "@/src/stores/apis/warehouseApi";

export default function Page() {
    const { warehouseAdminId }: { warehouseAdminId: string } = useParams();
    const router = useRouter();
    const {
        warehouseAdminState,
        patchWarehouseAdmin,
        setDetails
    } = useWarehouseAdmin();
    const modal = useModal();
    const [warehouses, setWarehouses] = useState<WarehouseResponse[]>([]);
    const [admins, setAdmins] = useState<AccountResponse[]>([]);

    const detailWarehouseAdminApiResult = warehouseAdminApi.useGetWarehouseAdminQuery({
        id: warehouseAdminId,
    });

    const { data: warehouseData } = useWarehouse().getWarehousesApiResult;
    const { data: adminData } = accountApi.useGetAdminsQuery();

    useEffect(() => {
        if (detailWarehouseAdminApiResult.data?.data) {
            setDetails(detailWarehouseAdminApiResult.data.data);
        }
    }, [detailWarehouseAdminApiResult.data?.data]);

    useEffect(() => {
        if (warehouseData?.data) {
            setWarehouses(warehouseData.data);
        }
    }, [warehouseData]);

    useEffect(() => {
        if (adminData?.data) {
            setAdmins(adminData.data);
        }
    }, [adminData]);

    const initialValues = {
        id: warehouseAdminState.details?.id ?? "",
        warehouseId: warehouseAdminState.details?.warehouseId ?? "",
        accountId: warehouseAdminState.details?.accountId ?? "",
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required("ID is required."),
        warehouseId: Yup.string().required("Warehouse ID is required."),
        accountId: Yup.string().required("Account ID is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchWarehouseAdminRequest = {
            id: values.id,
            data: {
                warehouseId: values.warehouseId,
                accountId: values.accountId,
            }
        }
        return patchWarehouseAdmin(request)
            .then((data) => {
                modal.setContent({
                    header: "Update Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Update Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    if (detailWarehouseAdminApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-2/3">
                    <Spinner />
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Warehouse Admin Details</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-1/3">
                            <Autocomplete
                                className="mb-6 w-full"
                                label="Warehouse"
                                name="warehouseId"
                                placeholder="Type to search..."
                                selectedKey={props.values.warehouseId}
                                errorMessage={props.errors.warehouseId}
                                isInvalid={Boolean(props.errors.warehouseId)}
                                items={warehouses}
                                onSelectionChange={(key) => props.setFieldValue("warehouseId", key)}
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
                                selectedKey={props.values.accountId}
                                errorMessage={props.errors.accountId}
                                isInvalid={Boolean(props.errors.accountId)}
                                items={admins}
                                onSelectionChange={(key) => props.setFieldValue("accountId", key)}
                            >
                                {(item) => (
                                    <AutocompleteItem key={item.id}>
                                        {`${item.id} - ${item.name}`}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                            <Button type="submit" className="w-full mt-8">
                                Update
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}