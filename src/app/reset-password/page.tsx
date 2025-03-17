'use client'

import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {ResetPasswordRequest} from "@/src/stores/apis/authenticationApi";
import React, {useState} from "react";
import {VerificationSendRequest} from "@/src/stores/apis/verificationApi";
import {useVerification} from "@/src/hooks/useVerification";

export default function ResetPasswordForm() {
    const authentication = useAuthentication();
    const verification = useVerification();
    const modal = useModal();

    const initialValues = {
        email: "",
        otp: "",
        newPassword: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        otp: Yup.string().required("OTP is required."),
        newPassword: Yup.string().required("New password is required."),
    });
    
    const [isLoadingOtp, setIsLoadingOtp] = useState<boolean>(false)

    const handlePressOtp = (values: typeof initialValues) => {
        const emailValidation = Yup.string().email("Invalid email.").required("Email is required.");
        try {
            emailValidation.validateSync(values.email);
        } catch (error) {
            modal.setContent({
                header: "Email Error",
                body: `${(error as Yup.ValidationError).message}`,
            });
            modal.onOpenChange(true);
            return;
        }
        
        setIsLoadingOtp(true)
        const request: VerificationSendRequest = {
            email: values.email,
            type: "RESET_PASSWORD"
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
                setIsLoadingOtp(false)
                modal.onOpenChange(true);
            });
    }

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: ResetPasswordRequest = {
            email: values.email,
            otp: values.otp,
            newPassword: values.newPassword,
        };
        return authentication
            .resetPassword(request)
            .then((data) => {
                modal.setContent({
                    header: "Reset Password Succeed",
                    body: `${data.message}`,
                });
            })
            .catch((error) => {
                modal.setContent({
                    header: "Reset Password Failed",
                    body: `${error.data.message}`,
                });
            }).finally(() => {
                modal.onOpenChange(true);
                actions.setSubmitting(false);
            });
    };

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Reset Password</div>
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
                                    <Button 
                                        isLoading={isLoadingOtp}
                                        type="button"
                                        onPress={() => handlePressOtp(props.values)}
                                        className="w-1/3 h-14"
                                    >
                                        Send OTP
                                    </Button>
                                </div>
                                <FormInput name="newPassword" label="New Password" type="password"/>
                                <Button type="submit" className="w-full mt-4">
                                    Reset Password
                                </Button>
                            </Form>
                    }
                </Formik>
            </div>
        </div>
    );
}