"use client"
import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Textarea} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {useProduct} from "@/src/hooks/useProduct";
import {useRouter} from "next/navigation";
import {ProductRequest} from "@/src/stores/apis/productApi";
import {convertFileToHexString, convertHexStringToBase64Data} from "@/src/tools/converterTool";
import Image from "next/image";
import {useCategory} from "@/src/hooks/useCategory";
import React from "react";

export default function Page() {
    const router = useRouter();
    const {
        productState,
        addProduct,
    } = useProduct();
    const {
        categoryState,
        setGetCategoriesRequest,
        getCategoriesApiResult,
    } = useCategory();
    const modal = useModal();

    const initialValues = {
        categoryId: "",
        name: "",
        description: "",
        price: 0,
        image: "",
    };

    const validationSchema = Yup.object().shape({
        categoryId: Yup.string().required("Category ID is required."),
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
        price: Yup.number().required("Price is required."),
        image: Yup.mixed(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: ProductRequest = {
            categoryId: values.categoryId,
            name: values.name,
            description: values.description,
            price: values.price,
            image: values.image
        }
        return addProduct(request)
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

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Add Product</h1>
                <form className="w-2/3 md:w-1/3" onSubmit={formik.handleSubmit}>
                    <Autocomplete
                        className="mb-6 w-full"
                        label="Category"
                        name="categoryId"
                        placeholder="Type to search..."
                        selectedKey={formik.values.categoryId}
                        errorMessage={formik.errors.categoryId}
                        isInvalid={Boolean(formik.errors.categoryId)}
                        inputValue={categoryState.getCategoriesRequest.search}
                        isLoading={getCategoriesApiResult.isFetching}
                        items={getCategoriesApiResult.data?.data ?? []}
                        onInputChange={(input) => {
                            setGetCategoriesRequest({
                                size: categoryState.getCategoriesRequest.size,
                                page: categoryState.getCategoriesRequest.page,
                                search: input,
                            });
                        }}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("categoryId", key);
                            const item = getCategoriesApiResult.data?.data?.find((item) => item.id === key);
                            setGetCategoriesRequest({
                                size: categoryState.getCategoriesRequest.size,
                                page: categoryState.getCategoriesRequest.page,
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
                    <Input
                        className="mb-6 w-full"
                        name="name"
                        label="Name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.name)}
                        errorMessage={formik.errors.name}
                        disabled={formik.isSubmitting}
                    />
                    <Textarea
                        className="mb-6 w-full"
                        name="description"
                        label="Description"
                        type="text"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.description)}
                        errorMessage={formik.errors.description}
                        disabled={formik.isSubmitting}
                    />
                    <Input
                        className="mb-6 w-full"
                        name="price"
                        label="Price"
                        type="number"
                        value={`${formik.values.price}`}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={Boolean(formik.errors.price)}
                        errorMessage={formik.errors.price}
                        disabled={formik.isSubmitting}
                    />
                    <div className="flex gap-4 w-full">
                        <div>
                            <div className="relative w-[8rem] h-[8rem] mb-4">
                                <Image
                                    className="rounded-md"
                                    src={
                                        formik.values.image
                                            ? convertHexStringToBase64Data(formik.values.image, "image/png")
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
                                   formik.setFieldValue("image", hexString);
                               }}
                        />
                    </div>
                    <Button type="submit" className="w-full mt-4">
                        Update
                    </Button>
                </form>
            </div>
        </div>
    )
}