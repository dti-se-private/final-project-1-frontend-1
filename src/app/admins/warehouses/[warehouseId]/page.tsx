'use client'

import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button, Spinner} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect} from "react";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {useParams, useRouter} from "next/navigation";
import {PatchWarehouseRequest, warehouseApi} from "@/src/stores/apis/warehouseApi";
import LocationPicker from "@/src/components/LocationPicker";
import L from "leaflet";
import * as wkx from "wkx";
import FormInputArea from "@/src/components/FormInputArea";

export default function Page() {
    const {warehouseId}: { warehouseId: string } = useParams();
    const router = useRouter();
    const {
        warehouseState,
        patchWarehouse,
        setDetails
    } = useWarehouse();
    const modal = useModal();

    const detailWarehouseApiResult = warehouseApi.useGetWarehouseQuery({
        id: warehouseId,
    });

    useEffect(() => {
        if (detailWarehouseApiResult.data?.data) {
            setDetails(detailWarehouseApiResult.data.data);
        }
    }, [detailWarehouseApiResult.data?.data]);

    const initialValues = {
        id: warehouseState.details?.id ?? "",
        name: warehouseState.details?.name ?? "",
        description: warehouseState.details?.description ?? "",
        location: warehouseState.details?.location ?? "",
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required("ID is required."),
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
        location: Yup.string().required("Location is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: PatchWarehouseRequest = {
            id: values.id,
            data: {
                name: values.name,
                description: values.description,
                location: values.location,
            }
        }
        return patchWarehouse(request)
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
        if (!location || location.length % 2 !== 0) {
            return {lat: 0, lng: 0};
        }
        const buffer = Buffer.from(location, "hex");
        const geometry = wkx.Geometry.parse(buffer);
        const geoJson = geometry.toGeoJSON() as { type: string, coordinates: number[] };
        return {lat: geoJson.coordinates[1], lng: geoJson.coordinates[0]};
    }

    if (detailWarehouseApiResult.isLoading) {
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
                <h1 className="text-center mb-8 text-4xl font-bold">Warehouse Details</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-2/3">
                            <FormInput name="id" label="ID" type="text" isDisabled/>
                            <FormInput name="name" label="Name" type="text"/>
                            <FormInputArea name="description" label="Description" type="text"/>
                            <LocationPicker
                                position={getPosition(props.values.location)}
                                onChangePosition={(position: L.LatLng) => {
                                    const wkb = new wkx.Point(position.lng, position.lat).toWkb();
                                    props.setFieldValue("location", wkb.toString("hex"));
                                }}
                            />
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