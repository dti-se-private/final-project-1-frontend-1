'use client'

import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {RegisterByExternalRequest, RegisterByInternalRequest} from "@/src/stores/apis/authenticationApi";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {CodeResponse, CredentialResponse, GoogleLogin, TokenResponse, useGoogleLogin} from "@react-oauth/google";
import {VerificationSendRequest} from "@/src/stores/apis/verificationApi";
import React from "react";
import {useVerification} from "@/src/hooks/useVerification";

export default function Page() {
    const authentication = useAuthentication();
    const verification = useVerification();
    const modal = useModal();

    const initialValues = {
        email: "",
        otp: "",
        password: "",
        name: "",
        phone: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        otp: Yup.string().required("OTP is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: RegisterByInternalRequest = {
            email: values.email,
            otp: values.otp,
            password: values.password,
            name: values.name,
            phone: values.phone,
        }
        return authentication
            .registerByInternal(request)
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

    const handleGoogleLoginSuccess = (response: CodeResponse) => {
        console.log(response);
        const request: RegisterByExternalRequest = {
            authorizationCode: response.code
        }
        return authentication
            .registerByExternal(request)
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
            });
    }


    const handleGoogleLoginError = () => {
        modal.setContent({
            header: "Register Failed",
            body: `Register by Google failed`,
        });
        modal.onOpenChange(true);
    }


    const handlePressOtp = (values: typeof initialValues) => {
        const request: VerificationSendRequest = {
            email: values.email,
            type: "REGISTER"
        }
        return verification
            .send(request)
            .then((data) => {
                modal.setContent({
                    header: "Send OTP Succeed",
                    body: `${data.message}`,
                })
            })
            .catch((error) => {
                modal.setContent({
                    header: "Send OTP Failed",
                    body: `${error.data.message}`,
                })
            }).finally(() => {
                modal.onOpenChange(true);
            });
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
                <div className="mb-8 text-4xl font-bold">Register Now!</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {
                        (props) =>
                            <Form className="w-2/3 md:w-1/3">
                                <FormInput name="email" label="Email" type="email"/>
                                <div className="flex gap-4 mb-6 w-full">
                                    <FormInput className="" name="otp" label="OTP" type="text"/>
                                    <Button type="button" onPress={() => handlePressOtp(props.values)}
                                            className="w-1/3 h-14">
                                        Send OTP
                                    </Button>
                                </div>
                                <FormInput name="password" label="Password" type="password"/>
                                <FormInput name="name" label="Name" type="text"/>
                                <FormInput name="phone" label="Phone" type="text"/>
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                            </Form>
                    }
                </Formik>
                <Button onPress={() => googleLogin()}>
                    Google
                </Button>
            </div>
        </div>
    )
}