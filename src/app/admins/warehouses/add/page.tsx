'use client'

import * as Yup from "yup";
import {Form, Formik} from "formik";
import FormInput from "@/src/components/FormInput";
import {Button} from "@heroui/react";
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect, useState} from "react";
import {useWarehouse} from "@/src/hooks/useWarehouse";
import {useRouter} from "next/navigation";
import {WarehouseRequest} from "@/src/stores/apis/warehouseApi";
import LocationPicker from "@/src/components/LocationPicker";
import L from "leaflet";
import * as wkx from "wkx";
import FormInputArea from "@/src/components/FormInputArea";

export default function Page() {
    const router = useRouter();
    const {
        addWarehouse,
    } = useWarehouse();
    const modal = useModal();

    const [initialValues, setInitialValues] = useState({
        name: "",
        description: "",
        location: new wkx.Point(0, 0).toWkb().toString("hex"),
        isPrimary: false,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const wkb = new wkx.Point(position.coords.longitude, position.coords.latitude).toWkb();
            setInitialValues((prevState) => ({
                ...prevState,
                location: wkb.toString("hex"),
            }));
        });
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required."),
        description: Yup.string().required("Description is required."),
        location: Yup.string().required("Location is required."),
    });

    const handleSubmit = (values: typeof initialValues, actions: { setSubmitting: (arg0: boolean) => void; }) => {
        const request: WarehouseRequest = {
            name: values.name,
            description: values.description,
            location: values.location
        }
        return addWarehouse(request)
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

    const getPosition = (location: string): { lat: number, lng: number } => {
        const buffer = Buffer.from(location, "hex");
        const geometry = wkx.Geometry.parse(buffer);
        const geoJson = geometry.toGeoJSON() as { type: string, coordinates: number[] };
        return {lat: geoJson.coordinates[1], lng: geoJson.coordinates[0]};
    }

    return (
        <div className="py-8 flex flex-col justify-center items-center min-h-[80vh]">
            <div className="container flex flex-col justify-center items-center">
                <h1 className="text-center mb-8 text-4xl font-bold">Add Warehouse</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {(props) => (
                        <Form className="w-2/3 md:w-2/3">
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
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}