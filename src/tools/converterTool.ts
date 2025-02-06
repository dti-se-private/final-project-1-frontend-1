export const convertHexStringToBase64Data = (hexString: string, type: string): string => {
    const base64String = Buffer.from(hexString, "hex").toString("base64");
    return `data:${type}/png;base64,${base64String}`;
}