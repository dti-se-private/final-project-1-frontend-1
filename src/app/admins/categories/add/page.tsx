"use client"
import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React from "react";
import {useCategory} from "@/src/hooks/useCategory";
import {useRouter} from "next/navigation";
import {CategoryRequest} from "@/src/stores/apis/categoryApi";
import FormInputArea from "@/src/components/FormInputArea";

export default function Page() {
    const router = useRouter();
    const {
        categoryState,
        addCategory,
    } = useCategory();
    const modal = useModal();

    const initialValues = {
        name: "",
        description: "",
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: CategoryRequest = {
            name: values.name,
            description: values.description,
        }
        return addCategory(request)
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

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Add Category</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-2/3">
                            <FormInput name="name" label="Name" type="text"/>
                            <FormInputArea name="description" label="Description" type="text"/>
                            <Button type="submit" className="w-full mt-4">
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}