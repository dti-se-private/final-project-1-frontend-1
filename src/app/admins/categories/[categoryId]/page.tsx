'use client'

import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useCategory} from "@/src/hooks/useCategory";
import {useParams, useRouter} from "next/navigation";
import {categoryApi, PatchCategoryRequest} from "@/src/stores/apis/categoryApi";
import FormInputArea from "@/src/components/FormInputArea";

export default function Page() {
    const {categoryId}: { categoryId: string } = useParams();
    const router = useRouter();
    const {
        categoryState,
        patchCategory,
        setDetails
    } = useCategory();
    const modal = useModal();

    const detailCategoryApiResult = categoryApi.useGetCategoryQuery({
        id: categoryId,
    });

    const initialValues = {
        id: categoryState.details?.id ?? "",
        name: categoryState.details?.name ?? "",
        description: categoryState.details?.description ?? "",
    };

    useEffect(() => {
        if (detailCategoryApiResult.data?.data) {
            setDetails(detailCategoryApiResult.data.data);
        }
    }, [detailCategoryApiResult.data?.data]);

    const validationSchema = Yup.object().shape({
        id: Yup.string().required("ID is required."),
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchCategoryRequest = {
            id: values.id,
            data: {
                name: values.name,
                description: values.description,
            }
        }
        return patchCategory(request)
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

    if (detailCategoryApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Category Details</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-2/3">
                            <FormInput name="id" label="ID" type="text" isDisabled/>
                            <FormInput name="name" label="Name" type="text"/>
                            <FormInputArea name="description" label="Description" type="text"/>
                            <Button type="submit" className="w-full mt-4">
                                Update
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}