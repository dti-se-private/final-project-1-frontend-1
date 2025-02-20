"use client"
import * as Yup from "yup";
import {useFormik} from "formik";
import {Autocomplete, AutocompleteItem, Button, Input, Spinner, Textarea} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useProduct} from "@/src/hooks/useProduct";
import {useParams, useRouter} from "next/navigation";
import {PatchProductRequest, productApi} from "@/src/stores/apis/productApi";
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

    const formik = useFormik(({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    }))

    useEffect(() => {
        if (getCategoriesApiResult.data?.data) {
            const item = getCategoriesApiResult.data.data[0];
            formik.setFieldValue("categoryId", item.id);
            setGetCategoriesRequest({
                size: categoryState.getCategoriesRequest.size,
                page: categoryState.getCategoriesRequest.page,
                search: `${item?.id} - ${item?.name}`,
            });
        }
    }, [getCategoriesApiResult.isLoading]);

    if (detailProductApiResult.isLoading) {
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
                <div className="mb-8 text-4xl font-bold">Product Details</div>
                <form className="w-2/3 md:w-2/3" onSubmit={formik.handleSubmit}>
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
                        isClearable={false}
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