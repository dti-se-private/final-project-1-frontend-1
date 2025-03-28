import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {warehouseSlice} from "@/src/stores/slices/warehouseSlice";
import {PatchWarehouseRequest, warehouseApi, WarehouseRequest, WarehouseResponse} from "@/src/stores/apis/warehouseApi";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useWarehouse = () => {
    const dispatch = useDispatch();
    const warehouseState = useSelector((state: RootState) => state.warehouseSlice);
    const getWarehousesApiResult = warehouseApi.useGetWarehousesQuery(warehouseState.getWarehousesRequest);
    const getOriginWarehousesApiResult = warehouseApi.useGetWarehousesQuery(warehouseState.getOriginWarehousesRequest);
    const getDestinationWarehousesApiResult = warehouseApi.useGetWarehousesQuery(warehouseState.getDestinationWarehousesRequest);

    const [addWarehouseApiTrigger] = warehouseApi.useAddWarehouseMutation();
    const [patchWarehouseApiTrigger] = warehouseApi.usePatchWarehouseMutation();
    const [deleteWarehouseApiTrigger] = warehouseApi.useDeleteWarehouseMutation();

    const addWarehouse = async (request: WarehouseRequest) => {
        const addWarehouseApiResult = await addWarehouseApiTrigger(request).unwrap();
        getWarehousesApiResult.refetch();
        return addWarehouseApiResult;
    }

    const patchWarehouse = async (request: PatchWarehouseRequest) => {
        const patchWarehouseApiResult = await patchWarehouseApiTrigger(request).unwrap();
        dispatch(warehouseSlice.actions.setDetails(patchWarehouseApiResult.data));
        getWarehousesApiResult.refetch();
        return patchWarehouseApiResult;
    }

    const deleteWarehouse = async (request: OneRequest) => {
        const deleteWarehouseApiResult = await deleteWarehouseApiTrigger(request).unwrap();
        getWarehousesApiResult.refetch();
        return deleteWarehouseApiResult;
    }

    const setGetWarehousesRequest = (request: ManyRequest) => {
        dispatch(warehouseSlice.actions.setGetWarehousesRequest(request));
        getWarehousesApiResult.refetch();
    }

    const setGetOriginWarehousesRequest = (request: ManyRequest) => {
        dispatch(warehouseSlice.actions.setGetOriginWarehousesRequest(request));
        getOriginWarehousesApiResult.refetch();
    }

    const setGetDestinationWarehousesRequest = (request: ManyRequest) => {
        dispatch(warehouseSlice.actions.setGetDestinationWarehousesRequest(request));
        getDestinationWarehousesApiResult.refetch();
    }

    const setDetails = (warehouse: WarehouseResponse) => {
        dispatch(warehouseSlice.actions.setDetails(warehouse));
    }

    return {
        warehouseState,
        getWarehousesApiResult,
        getOriginWarehousesApiResult,
        getDestinationWarehousesApiResult,
        setGetWarehousesRequest,
        setGetOriginWarehousesRequest,
        setGetDestinationWarehousesRequest,
        setDetails,
        addWarehouse,
        patchWarehouse,
        deleteWarehouse
    };
};