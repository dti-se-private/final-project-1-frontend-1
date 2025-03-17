'use client'

import * as Yup from "yup";
import {useAuthentication} from "@/src/hooks/useAuthentication";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Avatar, Button, Input} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import {PatchAccountRequest} from "@/src/stores/apis/accountApi";
import React, {useState} from "react";
import {convertFileToHexString, convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {useVerification} from "@/src/hooks/useVerification";
import {VerificationSendRequest} from "@/src/stores/apis/verificationApi";

export default function Page() {
    const authentication = useAuthentication();
    const verification = useVerification();
    const modal = useModal();

    const initialValues = {
        id: authentication.state.account?.id ?? "",
        email: authentication.state.account?.email ?? "",
        password: "",
        otp: "",
        name: authentication.state.account?.name ?? "",
        phone: authentication.state.account?.phone ?? "",
        image: authentication.state.account?.image ?? "",
    };

    const internalValidationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        otp: Yup.string().required("OTP is required."),
        password: Yup.string().required("Password is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
        image: Yup.mixed(),
    });

    const externalValidationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email.").required("Email is required."),
        name: Yup.string().required("Name is required."),
        phone: Yup.string().required("Phone is required."),
        image: Yup.mixed(),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchAccountRequest = {
            id: values.id,
            data: {
                email: values.email,
                password: values.password,
                otp: values.otp,
                name: values.name,
                phone: values.phone,
                image: values.image,
            }
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
            type: "UPDATE_ACCOUNT"
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
                setIsLoadingOtp(false)
            });
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <div className="mb-8 text-4xl font-bold">Profile</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={authentication.state.session?.providers.includes("INTERNAL") ? internalValidationSchema : externalValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {
                        (props) =>
                            <Form className="w-2/3 md:w-1/3">
                                <FormInput name="id" label="ID" type="text" isDisabled/>
                                <FormInput name="email" label="Email" type="email"
                                           isDisabled={!authentication.state.session?.providers.includes("INTERNAL")}/>
                                {authentication.state.session?.providers.includes("INTERNAL") && (
                                    <div>
                                        <div className="flex gap-4 mb-6 w-full">
                                            <FormInput className="" name="otp" label="OTP" type="text"/>
                                            <Button
                                                type="button"
                                                isLoading={isLoadingOtp}
                                                onPress={() => handlePressOtp(props.values)}
                                                className="w-1/3 h-14"
                                            >
                                                Send OTP
                                            </Button>
                                        </div>
                                        <FormInput name="password" label="Password" type="password"/>
                                    </div>
                                )}
                                <FormInput name="name" label="Name" type="text"/>
                                <FormInput name="phone" label="Phone" type="text"/>
                                <div className="flex gap-4 w-full">
                                    <div>
                                        <Avatar
                                            isBordered
                                            size="lg"
                                            src={
                                                props.values.image
                                                    ? convertHexStringToBase64Data(props.values.image, "image/png")
                                                    : "https://placehold.co/400x400?text=A"
                                            }
                                        />
                                    </div>
                                    <Input name="image" label="Image" type="file"
                                           onChange={async (event) => {
                                               const files = event.target.files ?? [];

                                               if (files.length === 0) {
                                                   modal.setContent({
                                                       header: "Invalid File",
                                                       body: `No file selected.`,
                                                   });
                                                   modal.onOpenChange(true);
                                                   return;
                                               }

                                               if (files.length > 1) {
                                                   modal.setContent({
                                                       header: "Invalid File",
                                                       body: `Only one file is allowed.`,
                                                   });
                                                   modal.onOpenChange(true);
                                                   return;
                                               }

                                               for (const file of files) {
                                                   const extension = file.name.split('.').pop();
                                                   if (!extension) {
                                                       modal.setContent({
                                                           header: "Invalid File",
                                                           body: `File ${file.name} has no extension.`,
                                                       });
                                                       modal.onOpenChange(true);
                                                       return;
                                                   }
                                                   if (!["jpg", "jpeg", "png"].includes(extension)) {
                                                       modal.setContent({
                                                           header: "Invalid File",
                                                           body: `Only jpg, jpeg, and png files are allowed.`,
                                                       });
                                                       modal.onOpenChange(true);
                                                       return;
                                                   }

                                                   const hexString = await convertFileToHexString(file);
                                                   props.setFieldValue("image", hexString);
                                               }
                                           }}
                                    />
                                </div>
                                <Button type="submit" className="w-full mt-4">
                                    Update
                                </Button>
                            </Form>
                    }
                </Formik>
            </div>
        </div>
    )
}