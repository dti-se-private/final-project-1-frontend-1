import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {modalSlice} from "@/src/stores/slices/modalSlice";

export const useModal = () => {
    const dispatch = useDispatch();

    const state = useSelector((state: RootState) => state.modalSlice);

    const setContent = (content: object) => {
        dispatch(modalSlice.actions.setContent(content));
    }

    const onOpenChange = (isOpen: boolean) => {
        dispatch(modalSlice.actions.onOpenChange(isOpen));
    }

    return {
        state,
        setContent,
        onOpenChange,
    };
}
