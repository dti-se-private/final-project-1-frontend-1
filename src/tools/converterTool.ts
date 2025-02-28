export const convertHexStringToBase64Data = (hexString: string, type: string): string => {
    const base64String = Buffer.from(hexString, "hex").toString("base64");
    return `data:${type};base64,${base64String}`;
}

export const convertFileToHexString = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const bytes = new Uint8Array(arrayBuffer);
            const hexString = bytes.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
            resolve(hexString);
        }
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}