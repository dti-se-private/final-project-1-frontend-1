import {createSlice} from "@reduxjs/toolkit";

export interface SearchState {
    prevPage: number,
    currentPage: number,
}

export const searchSlice = createSlice({
    name: 'searchSlice',
    initialState: {
        prevPage: 0,
        currentPage: 0
    } as SearchState,
    reducers: {
        setPage: (state, action) => {
            const {prevPage, currentPage} = action.payload;
            state.prevPage = prevPage ?? state.currentPage
            state.currentPage = currentPage
        },
    },
});
