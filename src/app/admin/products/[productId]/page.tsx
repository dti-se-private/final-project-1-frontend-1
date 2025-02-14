"use client"
import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useProduct} from "@/src/hooks/useProduct";
import {useParams, useRouter} from "next/navigation";
import {PatchProductRequest, productApi} from "@/src/stores/apis/productApi";
import FormInputArea from "@/src/components/FormInputArea";
import Image from "next/image";
import {convertFileToHexString, convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useCategory} from "@/src/hooks/useCategory";

export default function Page() {
    const {productId}: { productId: string } = useParams();
    const router = useRouter();
    const {
        productState,
        patchProduct,
        setDetails
    } = useProduct();
    const {
        categoryState,
        setGetCategoriesRequest,
        getCategoriesApiResult,
    } = useCategory();
    const modal = useModal();

    const detailProductApiResult = productApi.useGetProductQuery({
        id: productId,
    });

    const initialValues = {
        id: productState.details?.id ?? "",
        categoryId: productState.details?.category.id ?? "",
        name: productState.details?.name ?? "",
        description: productState.details?.description ?? "",
        price: productState.details?.price ?? 0,
        image: productState.details?.image ?? "",
    };

    useEffect(() => {
        if (detailProductApiResult.data?.data) {
            setDetails(detailProductApiResult.data.data);
        }
    }, [detailProductApiResult.data?.data]);


    const validationSchema = Yup.object().shape({
        categoryId: Yup.string().required("Category ID is required."),
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
        price: Yup.number().required("Price is required."),
        image: Yup.mixed(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchProductRequest = {
            id: values.id,
            data: {
                categoryId: values.categoryId,
                name: values.name,
                description: values.description,
                price: values.price,
                image: values.image
            }
        }
        return patchProduct(request)
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

    if (detailProductApiResult.isFetching) {
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
                <h1 className="mb-8 text-4xl font-bold">Product Details</h1>
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
                                label="Category"
                                name="categoryId"
                                placeholder="Type to search..."
                                defaultSelectedKey={props.values.categoryId}
                                errorMessage={props.errors.categoryId}
                                isInvalid={!!props.errors.categoryId}
                                inputValue={categoryState.getCategoriesRequest.search}
                                isLoading={getCategoriesApiResult.isFetching}
                                items={getCategoriesApiResult.data?.data || []}
                                onInputChange={(input) => {
                                    setGetCategoriesRequest({
                                        size: categoryState.getCategoriesRequest.size,
                                        page: categoryState.getCategoriesRequest.page,
                                        search: input,
                                    });
                                }}
                                onSelectionChange={(key) => {
                                    props.setFieldValue("categoryId", key);
                                }}
                            >
                                {(item) => (
                                    <AutocompleteItem key={item.id}>
                                        {`${item.id} - ${item.name}`}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                            <FormInput name="name" label="Name" type="text"/>
                            <FormInputArea name="description" label="Description" type="text"/>
                            <FormInput name="price" label="Price" type="number"/>
                            <div className="flex gap-4 w-full">
                                <div>
                                    <div className="relative w-[8rem] h-[8rem] mb-4">
                                        <Image
                                            className="rounded-md"
                                            src={
                                                props.values.image
                                                    ? convertHexStringToBase64Data(props.values.image, "image/png")
                                                    : "https://placehold.co/400x400?text=product"
                                            }
                                            layout="fill"
                                            objectFit="cover"
                                            alt='product'
                                        />
                                    </div>
                                </div>
                                <Input name="image" label="Image" type="file"
                                       onChange={async (event) => {
                                           const file = event.target.files?.item(0);
                                           const hexString = await convertFileToHexString(file!);
                                           props.setFieldValue("image", hexString);
                                       }}
                                />
                            </div>
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