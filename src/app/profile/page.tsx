"use client"
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {Account, PatchOneAccountRequest} from "@/src/stores/apis/accountApi";

export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();

    const initialValues: Account | PatchOneAccountRequest = {
        id: authentication.state.account?.id ?? "",
        email: authentication.state.account?.email ?? "",
        password: "",
        name: authentication.state.account?.name ?? "",
        phone: authentication.state.account?.phone ?? "",
        image: authentication.state.account?.image ?? "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
        dob: Yup.date().required("Date of Birth is required."),
        referralCode: Yup.string(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchOneAccountRequest = {
            id: values.id,
            email: values.email,
            password: values.password,
            name: values.name,
            phone: values.phone,
            image: values.image,
        }
        return authentication
            .patchAccount(request)
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

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Profile</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    <Form className="w-2/3 md:w-1/3">
                        <FormInput name="id" label="ID" type="text" isDisabled/>
                        <FormInput name="email" label="Email" type="email"/>
                        <FormInput name="password" label="Password" type="password"/>
                        <FormInput name="name" label="Name" type="text"/>
                        <FormInput name="phone" label="Phone" type="text"/>
                        <FormInput name="image" label="Image" type="text"/>
                        <Button type="submit" className="w-full">
                            Update
                        </Button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}