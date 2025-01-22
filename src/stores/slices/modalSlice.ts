import {createSlice} from "@reduxjs/toolkit";
import {ReactNode} from "react";

export interface ModalState {
    isOpen: boolean;
    header?: ReactNode;
    body?: ReactNode;
}

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: {
        isOpen: false,
        header: undefined,
        body: undefined,
    } as ModalState,
    reducers: {
        setContent: (state, action) => {
            const {header, body} = action.payload;
            state.header = header;
            state.body = body;
        },
        onOpenChange: (state, action) => {
            state.isOpen = action.payload;
        }
    }
});
