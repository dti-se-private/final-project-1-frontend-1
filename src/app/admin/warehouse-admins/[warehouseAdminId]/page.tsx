"use client"
import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useWarehouseAdmin} from "@/src/hooks/useWarehouseAdmin";
import {useParams, useRouter} from "next/navigation";
import {warehouseAdminApi, PatchWarehouseAdminRequest} from "@/src/stores/apis/warehouseAdminApi";

export default function Page() {
    const {warehouseAdminId}: { warehouseAdminId: string } = useParams();
    const router = useRouter();
    const {
        warehouseAdminState,
        patchWarehouseAdmin,
        setDetails
    } = useWarehouseAdmin();
    const modal = useModal();

    const detailWarehouseAdminApiResult = warehouseAdminApi.useGetWarehouseAdminQuery({
        id: warehouseAdminId,
    });

    useEffect(() => {
        if (detailWarehouseAdminApiResult.data?.data) {
            setDetails(detailWarehouseAdminApiResult.data.data);
        }
    }, [detailWarehouseAdminApiResult.data?.data]);

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
                    <Spinner/>
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
                            <FormInput name="id" label="ID" type="text" isDisabled/>
                            <FormInput name="warehouseId" label="Warehouse ID" type="text"/>
                            <FormInput name="accountId" label="Account ID" type="text"/>
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