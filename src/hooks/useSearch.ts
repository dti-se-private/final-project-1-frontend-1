import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productApi, RetrieveProductResponse, SearchProductRequest} from "@/src/stores/apis/productApi";
import {useEffect} from "react";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {searchSlice} from "@/src/stores/slices/searchSlice";

export const useSearch = () => {
    const dispatch = useDispatch();

    const searchState = useSelector((state: RootState) => state.searchSlice);

    const searcherState = useSelector((state: RootState) => state.searcherSlice);

    const productApiResult = productApi.useSearchProductsQuery(searcherState.request)

    const setRequest = (request: SearchProductRequest) => {
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
        let newProducts: RetrieveProductResponse[] = [];
        if (searcherState.request.filters.length > 0) {
            newProducts = productApiResult.data?.data ?? [];
        }
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
            filters: ["name", "description", "category", "location", "time"]
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
