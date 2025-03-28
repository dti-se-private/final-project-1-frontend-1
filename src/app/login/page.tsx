'use client'

import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {LoginByExternalRequest, LoginByInternalRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {useRouter} from "next/navigation";
import {CodeResponse, useGoogleLogin} from "@react-oauth/google";
import {FcGoogle} from "react-icons/fc";
import React from "react";

export default function Page() {
    const authentication = useAuthentication();
    const modal = useModal();
    const router = useRouter();

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        password: Yup.string().required("Password is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: LoginByInternalRequest = {
            email: values.email,
            password: values.password,
        }
        return authentication
            .loginByInternal(request)
            .then((data) => {
                modal.setContent({
                    header: "Login Succeed",
                    body: `${data.message}`
                })
                router.push("/");
            })
            .catch((error) => {
                modal.setContent({
                    header: "Login Failed",
                    body: `${error.data.message}`
                })
            })
            .finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };


    const handleGoogleLoginSuccess = (response: CodeResponse) => {
        console.log(response);
        const request: LoginByExternalRequest = {
            authorizationCode: response.code
        }
        return authentication
            .loginByExternal(request)
            .then((data) => {
                modal.setContent({
                    header: "Login Succeed",
                    body: `${data.message}`,
                })
                router.push("/");
            })
            .catch((error) => {
                modal.setContent({
                    header: "Login Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
            });
    }

    const handleForgotPassword = () => {
        router.push("/reset-password");
    }

    const handleGoogleLoginError = () => {
        modal.setContent({
            header: "Login Failed",
            body: `Login by Google failed`,
        });
        modal.onOpenChange(true);
    }

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginError,
        flow: 'auth-code',
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_REDIRECT_URI
    });

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center gap-8">
                <div className="mb-8 text-4xl font-bold">Login Now!</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="w-2/3 md:w-1/3">
                        <FormInput name="email" label="Email" type="email"/>
                        <FormInput name="password" label="Password" type="password"/>
                        <div className="text-left mb-4">
                            Forgot password? <span className="text-blue-500 cursor-pointer"
                                                   onClick={handleForgotPassword}> click here to reset</span>
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </Form>
                </Formik>
                <Button
                    className="w-2/3 md:w-1/3 gap-2"
                    onPress={() => googleLogin()}
                    variant="bordered"
                    color="primary"
                >
                    <FcGoogle size={24}/>
                    Login with Google
                </Button>
            </div>
        </div>
    )
}