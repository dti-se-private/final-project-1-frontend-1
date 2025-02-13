import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";
import {
    accountAddressApi,
    AccountAddressRequest,
    AccountAddressResponse,
    PatchAccountAddressRequest
} from "@/src/stores/apis/accountAddressApi";
import {ManyRequest, OneRequest} from "@/src/stores/apis";

export const useAccountAddress = () => {
    const dispatch = useDispatch();
    const accountAddressState = useSelector((state: RootState) => state.accountAddressSlice);
    const getAccountAddressesApiResult = accountAddressApi.useGetAccountAddressesQuery(accountAddressState.getAccountAddressesRequest);
    const [addAccountAddressApiTrigger] = accountAddressApi.useAddAccountAddressMutation();
    const [patchAccountAddressApiTrigger] = accountAddressApi.usePatchAccountAddressMutation();
    const [deleteAccountAddressApiTrigger] = accountAddressApi.useDeleteAccountAddressMutation();

    const addAccountAddress = async (request: AccountAddressRequest) => {
        const addAccountApiResult = await addAccountAddressApiTrigger(request).unwrap();
        getAccountAddressesApiResult.refetch();
        return addAccountApiResult;
    }

    const patchAccountAddress = async (request: PatchAccountAddressRequest) => {
        const patchAccountApiResult = await patchAccountAddressApiTrigger(request).unwrap();
        dispatch(accountAddressSlice.actions.setDetails(patchAccountApiResult.data));
        getAccountAddressesApiResult.refetch();
        return patchAccountApiResult;
    }

    const deleteAccountAddress = async (request: OneRequest) => {
        const deleteAccountApiResult = await deleteAccountAddressApiTrigger(request).unwrap();
        getAccountAddressesApiResult.refetch();
        return deleteAccountApiResult;
    }

    const setGetAccountAddressesRequest = (request: ManyRequest) => {
        dispatch(accountAddressSlice.actions.setGetAccountAddressesRequest(request));
        getAccountAddressesApiResult.refetch();
    }

    const setDetails = (accountAddress: AccountAddressResponse) => {
        dispatch(accountAddressSlice.actions.setDetails(accountAddress));
    }

    return {
        accountAddressState,
        getAccountAddressesApiResult,
        setGetAccountAddressesRequest,
        setDetails,
        addAccountAddress,
        patchAccountAddress,
        deleteAccountAddress
    };
}
