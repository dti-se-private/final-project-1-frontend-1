import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {categoryApi, CategoryResponse} from "@/src/stores/apis/categoryApi";
import {productApi, ProductResponse} from "@/src/stores/apis/productApi";
import {landingSlice} from "@/src/stores/slices/landingSlice";
import {ManyRequest} from "@/src/stores/apis";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";

export const useLanding = () => {
    const dispatch = useDispatch();

    const landingState = useSelector((state: RootState) => state.landingSlice);

    const productApiResult = productApi.useGetProductsQuery({
        page: landingState.getProductsRequest.page,
        size: landingState.getProductsRequest.size,
        search: landingState.getProductsRequest.search + (landingState.category?.id ? `${landingState.category?.id}` : '')
    });

    const categoryApiResult = categoryApi.useGetCategoriesQuery(landingState.getCategoriesRequest);

    const setCategory = (category: CategoryResponse) => {
        dispatch(landingSlice.actions.setCategory(category));
    }

    const setGetProductsRequest = (request: ManyRequest) => {
        dispatch(landingSlice.actions.setGetProductsRequest(request));
    }

    const setGetCategoriesRequest = (request: ManyRequest) => {
        dispatch(landingSlice.actions.setGetCategoriesRequest(request));
    }

    const setDetails = (product: ProductResponse) => {
        dispatch(accountAddressSlice.actions.setDetails(product));
    }

    return {
        landingState,
        productApiResult,
        categoryApiResult,
        setCategory,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails
    };
}
