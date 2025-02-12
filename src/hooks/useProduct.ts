import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productApi, ProductRequest, ProductResponse} from "@/src/stores/apis/productApi";
import {productSlice} from "@/src/stores/slices/productSlice";
import {ManyRequest, OneRequest} from "@/src/stores/apis";
import { get } from "http";

export const useProduct = () => {
    const dispatch = useDispatch();
    const productState = useSelector((state: RootState) => state.productSlice);
    const getProductsApiResult = productApi.useGetProductsQuery(productState.getProductsRequest);
    const [addProductApiTrigger] = productApi.useAddProductMutation();
    const [patchProductApiTrigger] = productApi.usePatchProductMutation();
    const [deleteProductApiTrigger] = productApi.useDeleteProductMutation();
    
    const addProduct = async (product: ProductRequest) => {
        const addProductResult = await addProductApiTrigger(product).unwrap();
        getProductsApiResult.refetch();
        return addProductResult;
    }

    const patchProduct = async (product: ProductRequest & {id: string}) => {
        const patchProductResult = await patchProductApiTrigger(product).unwrap();
        dispatch(productSlice.actions.setDetails(patchProductResult.data));
        getProductsApiResult.refetch();
        return patchProductResult;
    }

    const deleteProduct = async (product: OneRequest) => {
        const deleteProductResult = await deleteProductApiTrigger(product).unwrap();
        getProductsApiResult.refetch();
        return deleteProductResult;
    }

    const setGetProductsRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetProductsRequest(request));
    }

    const setDetails = (product: ProductResponse) => {
        dispatch(productSlice.actions.setDetails(product));
    }

    return {
        productState,
        getProductsApiResult,
        addProduct,
        patchProduct,
        deleteProduct,
        setGetProductsRequest,
        setDetails
    }
}