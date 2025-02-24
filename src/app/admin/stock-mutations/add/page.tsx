"use client";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React from "react";
import {useWarehouseLedger} from "@/src/hooks/useWarehouseLedger";
import {useRouter} from "next/navigation";
import {AddMutationRequest} from "@/src/stores/apis/warehouseLedgerApi";

export default function AddWarehouseLedgerPage() {
    const router = useRouter();
    const {addMutation} = useWarehouseLedger();
    const modal = useModal();

    // Initial form values
    const initialValues = {
        productId: "",
        originWarehouseId: "",
        destinationWarehouseId: "",
        quantity: 0,
    };

    // Validation schema
    const validationSchema = Yup.object().shape({
        productId: Yup.string().required("Product ID is required."),
        originWarehouseId: Yup.string().required("Origin Warehouse ID is required."),
        destinationWarehouseId: Yup.string().required("Destination Warehouse ID is required."),
        quantity: Yup.number()
            .required("Quantity is required.")
            .min(1, "Quantity must be at least 1."),
    });

    // Handle form submission
    const handleSubmit = (
        values: typeof initialValues,
        actions: { setSubmitting: (arg0: boolean) => void }
    ) => {
        const request: AddMutationRequest = {
            productId: values.productId,
            originWarehouseId: values.originWarehouseId,
            destinationWarehouseId: values.destinationWarehouseId,
            quantity: values.quantity,
        };

        return addMutation(request)
            .then((data) => {
                modal.setContent({
                    header: "Mutation Added Successfully",
                    body: `${data.message}`,
                });
                router.push("/admin/warehouse-ledgers"); // Redirect to the warehouse ledger list page
            })
            .catch((error) => {
                modal.setContent({
                    header: "Add Mutation Failed",
                    body: `${error.data.message}`,
                });
            })
            .finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Add Warehouse Ledger Mutation</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-1/3">
                            <FormInput name="productId" label="Product ID" type="text"/>
                            <FormInput name="originWarehouseId" label="Origin Warehouse ID" type="text"/>
                            <FormInput name="destinationWarehouseId" label="Destination Warehouse ID" type="text"/>
                            <FormInput name="quantity" label="Quantity" type="number"/>
                            <Button type="submit" className="w-full mt-4">
                                Add Mutation
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}