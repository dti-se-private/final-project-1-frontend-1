import { FC } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, Button } from "@heroui/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    header: string;
    body: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({ isOpen, header, body, onCancel, onConfirm }) => {
    return (
        <Modal size="3xl" isOpen={isOpen} onOpenChange={onCancel}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {header}
                        </ModalHeader>
                        <ModalBody>
                            {body}
                            <div className="flex justify-end gap-4 mt-4">
                                <Button onPress={onCancel}>Cancel</Button>
                                <Button color="danger" onPress={onConfirm}>Confirm</Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ConfirmationModal;