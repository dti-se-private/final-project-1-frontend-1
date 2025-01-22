import JsonView from "@uiw/react-json-view";

export interface JsonProps {
    value: object;
}

export default function Component(props: JsonProps) {
    return (
        <JsonView
            value={props.value}
            collapsed={1}
            shortenTextAfterLength={0}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
        />

    );
};
