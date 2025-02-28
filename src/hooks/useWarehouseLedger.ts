import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {warehouseLedgerSlice} from "@/src/stores/slices/warehouseLedgerSlice";
import {
    AddMutationRequest,
    ApprovalMutationRequest,
    warehouseLedgerApi,
    WarehouseLedgerResponse,
} from "@/src/stores/apis/warehouseLedgerApi";
import {ManyRequest} from "@/src/stores/apis";

export const useWarehouseLedger = () => {
    const dispatch = useDispatch();
    const warehouseLedgerState = useSelector((state: RootState) => state.warehouseLedgerSlice);

    const getMutationRequestsApiResult = warehouseLedgerApi.useGetMutationRequestsQuery(
        warehouseLedgerState.getMutationRequestsRequest
    );
    const [addMutationRequestApiTrigger] = warehouseLedgerApi.useAddMutationRequestMutation();
    const [approveMutationRequestApiTrigger] = warehouseLedgerApi.useApproveMutationRequestMutation();
    const [rejectMutationRequestApiTrigger] = warehouseLedgerApi.useRejectMutationRequestMutation();

    const addMutationRequest = async (request: AddMutationRequest) => {
        const addMutationApiResult = await addMutationRequestApiTrigger(request).unwrap();
        getMutationRequestsApiResult.refetch();
        return addMutationApiResult;
    };

    const approveMutationRequest = async (request: ApprovalMutationRequest) => {
        const approveMutationApiResult = await approveMutationRequestApiTrigger(request).unwrap();
        getMutationRequestsApiResult.refetch();
        return approveMutationApiResult;
    };

    const rejectMutationRequest = async (request: ApprovalMutationRequest) => {
        const rejectMutationApiResult = await rejectMutationRequestApiTrigger(request).unwrap();
        getMutationRequestsApiResult.refetch();
        return rejectMutationApiResult;
    };

    const setGetMutationRequestsRequest = (request: ManyRequest) => {
        dispatch(warehouseLedgerSlice.actions.setGetMutationRequestsRequest(request));
    };

    const setDetails = (warehouseLedger: WarehouseLedgerResponse) => {
        dispatch(warehouseLedgerSlice.actions.setDetails(warehouseLedger));
    };

    return {
        warehouseLedgerState,
        getMutationRequestsApiResult,
        setGetMutationRequestsRequest,
        setDetails,
        addMutationRequest,
        approveMutationRequest,
        rejectMutationRequest,
    };
};