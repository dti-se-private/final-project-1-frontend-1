import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {warehouseAdminSlice} from "@/src/stores/slices/warehouseAdminSlice";
import {
    warehouseAdminApi,
    WarehouseAdminRequest,
    WarehouseAdminResponse,
    PatchWarehouseAdminRequest
} from "@/src/stores/apis/warehouseAdminApi";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useWarehouseAdmin = () => {
    const dispatch = useDispatch();
    const warehouseAdminState = useSelector((state: RootState) => state.warehouseAdminSlice);
    const getWarehouseAdminsApiResult = warehouseAdminApi.useGetWarehouseAdminsQuery(warehouseAdminState.getWarehouseAdminRequest);
    const [addWarehouseAdminApiTrigger] = warehouseAdminApi.useAddWarehouseAdminMutation();
    const [patchWarehouseAdminApiTrigger] = warehouseAdminApi.usePatchWarehouseAdminMutation();
    const [deleteWarehouseAdminApiTrigger] = warehouseAdminApi.useDeleteWarehouseAdminMutation();

    const addWarehouseAdmin = async (request: WarehouseAdminRequest) => {
        const addWarehouseAdminApiResult = await addWarehouseAdminApiTrigger(request).unwrap();
        getWarehouseAdminsApiResult.refetch();
        return addWarehouseAdminApiResult;
    }

    const patchWarehouseAdmin = async (request: PatchWarehouseAdminRequest) => {
        const patchWarehouseAdminApiResult = await patchWarehouseAdminApiTrigger(request).unwrap();
        dispatch(warehouseAdminSlice.actions.setDetails(patchWarehouseAdminApiResult.data));
        getWarehouseAdminsApiResult.refetch();
        return patchWarehouseAdminApiResult;
    }

    const deleteWarehouseAdmin = async (request: OneRequest) => {
        const deleteWarehouseAdminApiResult = await deleteWarehouseAdminApiTrigger(request).unwrap();
        getWarehouseAdminsApiResult.refetch();
        return deleteWarehouseAdminApiResult;
    }

    const setGetWarehouseAdminsRequest = (request: ManyRequest) => {
        dispatch(warehouseAdminSlice.actions.setGetWarehouseAdminRequest(request));
    }

    const setDetails = (warehouseAdmin: WarehouseAdminResponse) => {
        dispatch(warehouseAdminSlice.actions.setDetails(warehouseAdmin));
    }

    return {
        warehouseAdminState,
        getWarehouseAdminsApiResult,
        setGetWarehouseAdminsRequest,
        setDetails,
        addWarehouseAdmin,
        patchWarehouseAdmin,
        deleteWarehouseAdmin
    };
};