import {createSlice} from "@reduxjs/toolkit";

export interface LandingState {
    prevPage: number,
    currentPage: number,
}

export const landingSlice = createSlice({
    name: 'landingSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0
    } as LandingState,
    reducers: {
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage
            state.currentPage = currentPage
        },
    },
});
