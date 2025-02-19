"use client"
import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Spinner} from "@heroui/react";
import React, {useEffect} from "react";
import {useWarehouseAdmin} from "@/src/hooks/useWarehouseAdmin";
import {useRouter} from "next/navigation";
import {WarehouseAdminRequest} from "@/src/stores/apis/warehouseAdminApi";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {useModal} from "@/src/hooks/useModal";
import {useAccount} from "@/src/hooks/useAccount";

interface ExistingPair {
    id: string;
    warehouseId: string;
    accountId: string;
}

export default function Page() {
    const router = useRouter();
    const modal = useModal();
    const {
        warehouseAdminState,
        addWarehouseAdmin,
    } = useWarehouseAdmin();
    const {
        accountState,
        setGetAccountAdminsRequest,
        getAccountAdminsApiResult,
    } = useAccount();
    const {
        warehouseState,
        setGetWarehousesRequest,
        getWarehousesApiResult,
    } = useWarehouse();


    useEffect(() => {
        setGetWarehousesRequest({
            size: warehouseState.getWarehousesRequest.size,
            page: warehouseState.getWarehousesRequest.page,
            search: "",
        });
    }, []);

    const initialValues = {
        warehouseId: "",
        accountId: "",
    };

    const validationSchema = Yup.object().shape({
        warehouseId: Yup.string().required("Warehouse ID is required."),
        accountId: Yup.string().required("Account ID is required."),
    });

    const handleSubmit = async (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: WarehouseAdminRequest = {
            warehouseId: values.warehouseId,
            accountId: values.accountId,
        }
        return addWarehouseAdmin(request)
            .then((data) => {
                modal.setContent({
                    header: "Add Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Add Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    const formik = useFormik(({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    }))

    if (getWarehousesApiResult.isLoading || getAccountAdminsApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Add Warehouse Admin</h1>
                <form className="w-2/3 md:w-2/3" onSubmit={formik.handleSubmit}>
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
                        items={getAccountAdminsApiResult.data?.data ?? []}
                        onInputChange={(input) => {
                            setGetAccountAdminsRequest({
                                size: accountState.getAccountAdminsRequest.size,
                                page: accountState.getAccountAdminsRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("accountId", key)
                            const item = getAccountAdminsApiResult.data?.data?.find((item) => item.id === key);
                            setGetAccountAdminsRequest({
                                size: accountState.getAccountAdminsRequest.size,
                                page: accountState.getAccountAdminsRequest.page,
                                search: `${item?.id} - ${item?.name} - ${item?.email}`
                            });
                        }}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.id}>
                                {`${item.id} - ${item.name} - ${item.email}`}
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <Button type="submit" className="w-full mt-4">
                        Add
                    </Button>
                </form>
            </div>
        </div>
    )
}