import { useState } from "react";

interface ModalContent {
    header: string;
    body: string;
}

export const useDeleteConfirmation = (onConfirm: () => void) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({ header: "", body: "" });

    const showModal = (header: string, body: string) => {
        setModalContent({ header, body });
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onConfirm();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return {
        isModalOpen,
        modalContent,
        setModalContent,
        showModal,
        handleConfirm,
        handleCancel,
    };
};