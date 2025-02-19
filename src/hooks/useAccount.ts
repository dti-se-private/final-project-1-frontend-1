import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {accountSlice} from "@/src/stores/slices/accountSlice";
import {accountApi, AccountResponse} from "@/src/stores/apis/accountApi";
import {ManyRequest} from "@/src/stores/apis";

export const useAccount = () => {
    const dispatch = useDispatch();
    const accountState = useSelector((state: RootState) => state.accountSlice);
    const getAccountAdminsApiResult = accountApi.useGetAccountAdminsQuery(accountState.getAccountAdminsRequest);

    const setGetAccountAdminsRequest = (request: ManyRequest) => {
        dispatch(accountSlice.actions.setGetAccountAdminsRequest(request));
        getAccountAdminsApiResult.refetch();
    }

    const setDetails = (account: AccountResponse) => {
        dispatch(accountSlice.actions.setDetails(account));
    }

    return {
        accountState,
        getAccountAdminsApiResult,
        setGetAccountAdminsRequest,
        setDetails,
    };
}
