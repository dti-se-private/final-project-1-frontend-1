"use client"
import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button, Checkbox, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useAccountAddress} from "@/src/hooks/useAccountAddress";
import {useParams, useRouter} from "next/navigation";
import {accountAddressApi, PatchAccountAddressRequest} from "@/src/stores/apis/accountAddressApi";
import LocationPicker from "@/src/components/LocationPicker";
import L from "leaflet";
import * as wkx from "wkx";
import FormInputArea from "@/src/components/FormInputArea";

export default function Page() {
    const {addressId}: { addressId: string } = useParams();
    const router = useRouter();
    const {
        accountAddressState,
        patchAccountAddress,
        setDetails
    } = useAccountAddress();
    const modal = useModal();

    const detailAccountAddressApiResult = accountAddressApi.useGetAccountAddressQuery({
        id: addressId,
    });

    useEffect(() => {
        if (detailAccountAddressApiResult.data?.data) {
            setDetails(detailAccountAddressApiResult.data.data);
        }
    }, [detailAccountAddressApiResult.data?.data]);


    const initialValues = {
        id: accountAddressState.details?.id ?? "",
        name: accountAddressState.details?.name ?? "",
        address: accountAddressState.details?.address ?? "",
        location: accountAddressState.details?.location ?? "",
        isPrimary: accountAddressState.details?.isPrimary ?? false,
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required("ID is required."),
        name: Yup.string().required("Name is required."),
        address: Yup.string().required("Address is required."),
        location: Yup.string().required("Location is required."),
        isPrimary: Yup.boolean().required("Is Primary is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchAccountAddressRequest = {
            id: values.id,
            data: {
                name: values.name,
                address: values.address,
                location: values.location,
                isPrimary: values.isPrimary,
            }
        }
        return patchAccountAddress(request)
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

    const getPosition = (location: string): { lat: number, lng: number } => {
        const buffer = Buffer.from(location, "hex");
        const geometry = wkx.Geometry.parse(buffer);
        const geoJson = geometry.toGeoJSON() as { type: string, coordinates: number[] };
        return {lat: geoJson.coordinates[1], lng: geoJson.coordinates[0]};
    }


    if (detailAccountAddressApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-2/3">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="mb-8 text-4xl font-bold">Address Details</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-1/3">
                            <FormInput name="id" label="ID" type="text" isDisabled/>
                            <FormInput name="name" label="Name" type="text"/>
                            <FormInputArea name="address" label="Address" type="text"/>
                            <LocationPicker
                                position={getPosition(props.values.location)}
                                onChangePosition={(position: L.LatLng) => {
                                    const wkb = new wkx.Point(position.lng, position.lat).toWkb();
                                    props.setFieldValue("location", wkb.toString("hex"));
                                }}
                            />
                            <Checkbox
                                className="mt-4"
                                name="isPrimary"
                                isSelected={props.values.isPrimary}
                                onChange={props.handleChange}
                            >Is Primary
                            </Checkbox>
                            <Button type="submit" className="w-full mt-8">
                                Update
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}