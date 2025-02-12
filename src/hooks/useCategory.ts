import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {categoryApi, CategoryRequest, CategoryResponse} from "@/src/stores/apis/categoryApi";
import {categorySlice} from "@/src/stores/slices/categorySlice";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useCategory = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state: RootState) => state.categorySlice);
    const getCategoriesApiResult = categoryApi.useGetCategoriesQuery(categoryState.getCategoriesRequest);
    const [addCategoryApiTrigger] = categoryApi.useAddCategoryMutation();
    const [patchCategoryApiTrigger] = categoryApi.usePatchCategoryMutation();
    const [deleteCategoryApiTrigger] = categoryApi.useDeleteCategoryMutation();

    const addCategory = async (request: CategoryRequest) => {
        const addResult = await addCategoryApiTrigger(request).unwrap();
        getCategoriesApiResult.refetch();
        return addResult;
    }

    const patchCategory = async (request: CategoryRequest & { id: string }) => {
        const patchResult = await patchCategoryApiTrigger(request).unwrap();
        dispatch(categorySlice.actions.setDetails(patchResult.data));
        getCategoriesApiResult.refetch();
        return patchResult;
    }

    const deleteCategory = async (request: OneRequest) => {
        const deleteResult = await deleteCategoryApiTrigger(request).unwrap();
        getCategoriesApiResult.refetch();
        return deleteResult;
    }

    const setGetCategoriesRequest = (request: ManyRequest) => {
        dispatch(categorySlice.actions.setGetCategoriesRequest(request));
    }

    const setDetails = (category: CategoryResponse) => {
        dispatch(categorySlice.actions.setDetails(category));
    }

    return {
        categoryState,
        getCategoriesApiResult,
        addCategory,
        patchCategory,
        deleteCategory,
        setGetCategoriesRequest,
        setDetails
    };
}