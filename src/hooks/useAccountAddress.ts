import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {useEffect} from "react";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";
import {accountAddressApi} from "@/src/stores/apis/addressApi";

export const useAccountAddress = () => {
    const dispatch = useDispatch();
    const accountAddressState = useSelector((state: RootState) => state.accountAddressSlice);
    const accountAddressApiResult = accountAddressApi.useGetAccountAddressesQuery({
        page: accountAddressState.currentPage,
        size: 10,
        search: ""
    });

    const setPage = (page: number) => {
        if (page >= 0) {
            dispatch(accountAddressSlice.actions.setPage({
                prevPage: accountAddressState.currentPage,
                currentPage: page
            }));
        }
    }

    useEffect(() => {
        accountAddressApiResult.refetch();
    }, [accountAddressState.prevPage, accountAddressState.currentPage]);

    return {
        accountAddressState,
        accountAddressApiResult,
        setPage
    };
}
