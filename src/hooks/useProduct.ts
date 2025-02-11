import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {categoryApi, CategoryResponse} from "@/src/stores/apis/categoryApi";
import {productApi, ProductResponse} from "@/src/stores/apis/productApi";
import {productSlice} from "@/src/stores/slices/productSlice";
import {ManyRequest} from "@/src/stores/apis";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";

export const useProduct = () => {
    const dispatch = useDispatch();

    const productState = useSelector((state: RootState) => state.productSlice);

    const productApiResult = productApi.useGetProductsQuery({
        page: productState.getProductsRequest.page,
        size: productState.getProductsRequest.size,
        search: productState.getProductsRequest.search + (productState.category?.id ? `${productState.category?.id}` : '')
    });

    const categoryApiResult = categoryApi.useGetCategoriesQuery(productState.getCategoriesRequest);

    const setCategory = (category: CategoryResponse) => {
        dispatch(productSlice.actions.setCategory(category));
    }

    const setGetProductsRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetProductsRequest(request));
    }

    const setGetCategoriesRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetCategoriesRequest(request));
    }

    const setDetails = (product: ProductResponse) => {
        dispatch(productSlice.actions.setDetails(product));
    }

    return {
        productState,
        productApiResult,
        categoryApiResult,
        setCategory,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails
    };
}
