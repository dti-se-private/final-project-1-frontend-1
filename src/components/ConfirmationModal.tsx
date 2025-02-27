import {FC} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";

interface ConfirmationModalProps {
    isOpen: boolean;
    header: string;
    body: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({isOpen, header, body, onCancel, onConfirm}) => {
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
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onCancel}>Cancel</Button>
                            <Button color="danger" onPress={onConfirm}>Confirm</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ConfirmationModal;