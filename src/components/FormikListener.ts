import {useFormikContext} from "formik";
import {useEffect} from "react";

export default function FormikListener(props: { onChange: (values: never) => void }) {
    const {values} = useFormikContext();

    useEffect(() => {
        props.onChange(values as never);
    }, [values]);

    return null;
}