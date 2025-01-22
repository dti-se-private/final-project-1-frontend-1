"use client"
import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {RegisterByEmailAndPasswordRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";

export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();

    const initialValues = {
        email: "",
        password: "",
        name: "",
        phone: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: RegisterByEmailAndPasswordRequest = {
            email: values.email,
            password: values.password,
            name: values.name,
            phone: values.phone,
        }
        return authentication
            .register(request)
            .then((data) => {
                modal.setContent({
                    header: "Register Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Register Failed",
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
                <h1 className="mb-8 text-4xl font-bold">Register Now!</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="w-2/3 md:w-1/3">
                        <FormInput name="email" label="Email" type="email"/>
                        <FormInput name="password" label="Password" type="password"/>
                        <FormInput name="name" label="Name" type="text"/>
                        <FormInput name="phone" label="Phone" type="text"/>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}