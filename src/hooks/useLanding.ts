import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productApi} from "@/src/stores/apis/productApi";
import {useEffect} from "react";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {landingSlice} from "@/src/stores/slices/landingSlice";

export const useLanding = () => {
    const dispatch = useDispatch();

    const landingState = useSelector((state: RootState) => state.landingSlice);

    const searcherState = useSelector((state: RootState) => state.searcherSlice);

    const productApiResult = productApi.useSearchProductsQuery(searcherState.request)

    const setCategory = (category: string) => {
        dispatch(landingSlice.actions.setPage({
            prevPage: 0,
            currentPage: 0,
        }));
        dispatch(searcherSlice.actions.setRequest({
            page: 0,
            search: category === "all" ? "" : category,
            filters: ["category"]
        }));
    }

    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(landingSlice.actions.setPage({
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
    }, [landingState.prevPage, landingState.currentPage]);

    useEffect(() => {
        productApiResult.refetch();
    }, []);

    return {
        productApiResult,
        searcherState,
        setCategory,
        setPage
    };
}
