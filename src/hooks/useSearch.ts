import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productApi} from "@/src/stores/apis/productApi";
import {useEffect} from "react";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {searchSlice} from "@/src/stores/slices/searchSlice";
import {GetManyRequest} from "@/src/stores/apis";

export const useSearch = () => {
    const dispatch = useDispatch();

    const searchState = useSelector((state: RootState) => state.searchSlice);

    const searcherState = useSelector((state: RootState) => state.searcherSlice);

    const productApiResult = productApi.useGetProductsQuery(searcherState.request)

    const setRequest = (request: GetManyRequest) => {
        dispatch(searchSlice.actions.setPage({
            prevPage: 0,
            currentPage: 0,
        }));
        dispatch(searcherSlice.actions.setRequest(request));
    }


    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(searchSlice.actions.setPage({
                currentPage: page
            }));
            dispatch(searcherSlice.actions.setRequest({
                page: page,
            }));
        }
    }

    useEffect(() => {
        const newProducts = productApiResult.data?.data ?? [];
        dispatch(searcherSlice.actions.setProducts({products: newProducts}));
    }, [productApiResult.data]);

    useEffect(() => {
        productApiResult.refetch();
    }, [searchState.prevPage, searchState.currentPage]);

    useEffect(() => {
        setRequest({
            page: 0,
            size: 10,
            search: '',
        });
        productApiResult.refetch();
    }, []);

    return {
        productApiResult,
        searcherState,
        setRequest,
        setPage
    };
}
