import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {categoryApi, CategoryResponse} from "@/src/stores/apis/categoryApi";
import {PatchProductRequest, productApi, ProductRequest, ProductResponse} from "@/src/stores/apis/productApi";
import {productSlice} from "@/src/stores/slices/productSlice";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useProduct = () => {
    const dispatch = useDispatch();

    const productState = useSelector((state: RootState) => state.productSlice);

    const getProductWithCategoryApiResult = productApi.useGetProductsQuery({
        page: productState.getProductsRequest.page,
        size: productState.getProductsRequest.size,
        search: productState.getProductsRequest.search + (productState.category?.id ? `${productState.category?.id}` : '')
    })

    const getProductsApiResult = productApi.useGetProductsQuery(productState.getProductsRequest);
    const [addProductApiTrigger] = productApi.useAddProductMutation();
    const [patchProductApiTrigger] = productApi.usePatchProductMutation();
    const [deleteProductApiTrigger] = productApi.useDeleteProductMutation();

    const addProduct = async (request: ProductRequest) => {
        const addProductResult = await addProductApiTrigger(request).unwrap();
        getProductsApiResult.refetch();
        return addProductResult;
    }

    const patchProduct = async (request: PatchProductRequest) => {
        const patchProductResult = await patchProductApiTrigger(request).unwrap();
        dispatch(productSlice.actions.setDetails(patchProductResult.data));
        getProductsApiResult.refetch();
        return patchProductResult;
    }

    const deleteProduct = async (request: OneRequest) => {
        const deleteProductResult = await deleteProductApiTrigger(request).unwrap();
        getProductsApiResult.refetch();
        return deleteProductResult;
    }

    const categoryApiResult = categoryApi.useGetCategoriesQuery(productState.getCategoriesRequest);

    const setCategory = (category: CategoryResponse) => {
        dispatch(productSlice.actions.setCategory(category));

    }

    const setGetProductsRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetProductsRequest(request));
        getProductsApiResult.refetch();
        getProductWithCategoryApiResult.refetch();
    }

    const setGetCategoriesRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetCategoriesRequest(request));
    }

    const setDetails = (product: ProductResponse) => {
        dispatch(productSlice.actions.setDetails(product));
    }

    return {
        productState,
        getProductWithCategoryApiResult,
        categoryApiResult,
        addProduct,
        deleteProduct,
        patchProduct,
        getProductsApiResult,
        setCategory,
        setGetProductsRequest,
        setGetCategoriesRequest,
        setDetails
    };
}
