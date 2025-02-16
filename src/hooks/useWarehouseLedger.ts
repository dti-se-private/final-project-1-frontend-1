import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { warehouseLedgerSlice } from "@/src/stores/slices/warehouseLedgerSlice";
import {
    warehouseLedgerApi,
    WarehouseLedgerResponse,
    AddMutationRequest,
    ApproveRejectRequest,
} from "@/src/stores/apis/warehouseLedgerApi";
import { ManyRequest } from "@/src/stores/apis";

export const useWarehouseLedger = () => {
    const dispatch = useDispatch();
    const warehouseLedgerState = useSelector((state: RootState) => state.warehouseLedgerSlice);

    // API hooks
    const getWarehouseLedgersApiResult = warehouseLedgerApi.useGetWarehouseLedgersQuery(
        warehouseLedgerState.getWarehouseLedgersRequest
    );
    const [addMutationApiTrigger] = warehouseLedgerApi.useAddMutationMutation();
    const [approveMutationApiTrigger] = warehouseLedgerApi.useApproveMutationMutation();
    const [rejectMutationApiTrigger] = warehouseLedgerApi.useRejectMutationMutation();

    // Add a new stock mutation
    const addMutation = async (request: AddMutationRequest) => {
        const addMutationApiResult = await addMutationApiTrigger(request).unwrap();
        getWarehouseLedgersApiResult.refetch(); // Refresh the list after adding
        return addMutationApiResult;
    };

    // Approve a stock mutation
    const approveMutation = async (request: ApproveRejectRequest) => {
        const approveMutationApiResult = await approveMutationApiTrigger(request).unwrap();
        getWarehouseLedgersApiResult.refetch(); // Refresh the list after approving
        return approveMutationApiResult;
    };

    // Reject a stock mutation
    const rejectMutation = async (request: ApproveRejectRequest) => {
        const rejectMutationApiResult = await rejectMutationApiTrigger(request).unwrap();
        getWarehouseLedgersApiResult.refetch(); // Refresh the list after rejecting
        return rejectMutationApiResult;
    };

    // Set the pagination and search request for fetching warehouse ledgers
    const setGetWarehouseLedgersRequest = (request: ManyRequest) => {
        dispatch(warehouseLedgerSlice.actions.setGetWarehouseLedgersRequest(request));
    };

    // Set the details of a specific warehouse ledger entry
    const setDetails = (warehouseLedger: WarehouseLedgerResponse) => {
        dispatch(warehouseLedgerSlice.actions.setDetails(warehouseLedger));
    };

    return {
        warehouseLedgerState,
        getWarehouseLedgersApiResult,
        setGetWarehouseLedgersRequest,
        setDetails,
        addMutation,
        approveMutation,
        rejectMutation,
    };
};