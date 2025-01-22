import {useFormikContext} from "formik";
import {Textarea} from "@heroui/react";
import {ComponentProps} from "react";

export default function FormInputArea(props: Readonly<ComponentProps<typeof Textarea>>) {
    const {isSubmitting, errors, handleChange, handleBlur, values} = useFormikContext();

    const nameSegments = props.name?.split(".");

    return (
        <Textarea
            {...props}
            className="mb-6 w-full"
            disabled={isSubmitting}
            onChange={handleChange}
            onBlur={handleBlur}
            value={
                nameSegments && (
                    nameSegments.length === 1 ?
                        // @ts-expect-error: Still compatible even in type lint error.
                        values[nameSegments[0]]
                        :
                        // @ts-expect-error: Still compatible even in type lint error.
                        nameSegments.length === 3 && values[nameSegments[0]] && values[nameSegments[0]][Number(nameSegments[1])] && values[nameSegments[0]][Number(nameSegments[1])][nameSegments[2]]
                )
            }
            // @ts-expect-error: Still compatible even in type lint error.
            isInvalid={Boolean(errors[props.name])}
            errorMessage={
                nameSegments && (
                    nameSegments.length === 1 ?
                        // @ts-expect-error: Still compatible even in type lint error.
                        errors[nameSegments[0]]
                        :
                        // @ts-expect-error: Still compatible even in type lint error.
                        nameSegments.length === 3 && errors[nameSegments[0]] && errors[nameSegments[0]][Number(nameSegments[1])] && errors[nameSegments[0]][Number(nameSegments[1])][nameSegments[2]]
                )
            }
        />
    );
};