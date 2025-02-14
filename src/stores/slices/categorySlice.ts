import {createSlice} from "@reduxjs/toolkit";
import {ManyRequest} from "@/src/stores/apis";
import {CategoryResponse} from "@/src/stores/apis/categoryApi";

export interface CategoryState {
    getCategoriesRequest: ManyRequest
    details?: CategoryResponse
}

export const categorySlice = createSlice({
    name: 'categorySlice',
    initialState: {
        getCategoriesRequest: {
            page: 0,
            size: 5,
            search: ''
        },
        details: undefined
    } as CategoryState,
    reducers: {
        setGetCategoriesRequest: (state, action) => {
            state.getCategoriesRequest = action.payload;
        },
        setDetails: (state, action) => {
            state.details = action.payload;
        },
    },
});

export const {setGetCategoriesRequest, setDetails} = categorySlice.actions;
export default categorySlice.reducer;