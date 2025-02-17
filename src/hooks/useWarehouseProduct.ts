import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {warehouseProductSlice} from "@/src/stores/slices/warehouseProductSlice";
import {
    warehouseProductApi,
    WarehouseProductRequest,
    WarehouseProductResponse,
    PatchWarehouseProductRequest
} from "@/src/stores/apis/warehouseProductApi";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useWarehouseProduct = () => {
    const dispatch = useDispatch();
    const warehouseProductState = useSelector((state: RootState) => state.warehouseProductSlice);
    const getWarehouseProductsApiResult = warehouseProductApi.useGetWarehouseProductsQuery(warehouseProductState.getWarehouseProductsRequest);
    const [addWarehouseProductApiTrigger] = warehouseProductApi.useAddWarehouseProductMutation();
    const [patchWarehouseProductApiTrigger] = warehouseProductApi.usePatchWarehouseProductMutation();
    const [deleteWarehouseProductApiTrigger] = warehouseProductApi.useDeleteWarehouseProductMutation();

    const addWarehouseProduct = async (request: WarehouseProductRequest) => {
        const addWarehouseProductApiResult = await addWarehouseProductApiTrigger(request).unwrap();
        getWarehouseProductsApiResult.refetch();
        return addWarehouseProductApiResult;
    }

    const patchWarehouseProduct = async (request: PatchWarehouseProductRequest) => {
        const patchWarehouseProductApiResult = await patchWarehouseProductApiTrigger(request).unwrap();
        dispatch(warehouseProductSlice.actions.setDetails(patchWarehouseProductApiResult.data));
        getWarehouseProductsApiResult.refetch();
        return patchWarehouseProductApiResult;
    }

    const deleteWarehouseProduct = async (request: OneRequest) => {
        const deleteWarehouseProductApiResult = await deleteWarehouseProductApiTrigger(request).unwrap();
        getWarehouseProductsApiResult.refetch();
        return deleteWarehouseProductApiResult;
    }

    const setGetWarehouseProductsRequest = (request: ManyRequest) => {
        dispatch(warehouseProductSlice.actions.setGetWarehouseProductsRequest(request));
    }

    const setDetails = (warehouseProduct: WarehouseProductResponse) => {
        dispatch(warehouseProductSlice.actions.setDetails(warehouseProduct));
    }

    return {
        warehouseProductState,
        getWarehouseProductsApiResult,
        setGetWarehouseProductsRequest,
        setDetails,
        addWarehouseProduct,
        patchWarehouseProduct,
        deleteWarehouseProduct
    };
};