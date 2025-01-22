import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    authenticationApi,
    LoginByEmailAndPasswordRequest,
    RegisterByEmailAndPasswordRequest,
    Session
} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {accountApi, PatchOneAccountRequest, RetrieveOneAccountRequest} from "@/src/stores/apis/accountApi";
import {useEffect} from "react";
import moment from "moment";

export const useAuthentication = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.authenticationSlice);
    const [loginApiTrigger] = authenticationApi.useLazyLoginByEmailAndPasswordQuery();
    const [registerApiTrigger] = authenticationApi.useRegisterByEmailAndPasswordMutation();
    const [logoutApiTrigger] = authenticationApi.useLazyLogoutQuery();
    const [refreshSessionApiTrigger] = authenticationApi.useLazyRefreshSessionQuery();
    const [retrieveAccountApiTrigger] = accountApi.useLazyRetrieveOneByIdQuery();
    const [patchAccountApiTrigger] = accountApi.usePatchOneByIdMutation();

    const retrieveAccount = async (request: RetrieveOneAccountRequest) => {
        const retrieveAccountApiResult = await retrieveAccountApiTrigger(request).unwrap();
        const values = retrieveAccountApiResult.data;
        if (values) {
            dispatch(authenticationSlice.actions.setAccount({
                account: {
                    ...values,
                    dob: moment(values.dob).format('YYYY-MM-DD'),
                },
            }));
        } else {
            dispatch(authenticationSlice.actions.setAccount({
                account: undefined,
            }));
        }
        return retrieveAccountApiResult;
    }

    const patchAccount = async (request: PatchOneAccountRequest) => {
        const patchAccountApiResult = await patchAccountApiTrigger(request).unwrap();
        const values = patchAccountApiResult.data;
        if (values) {
            dispatch(authenticationSlice.actions.setAccount({
                account: {
                    ...values,
                    dob: moment(values.dob).format('YYYY-MM-DD'),
                },
            }));
        } else {
            dispatch(authenticationSlice.actions.setAccount({
                account: undefined,
            }));
        }
        return patchAccountApiResult;
    }

    const login = async (request: LoginByEmailAndPasswordRequest) => {
        const loginApiResult = await loginApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.login({
            session: loginApiResult.data,
        }));
        return loginApiResult;
    }

    const register = async (request: RegisterByEmailAndPasswordRequest) => {
        const registerApiResult = await registerApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.register({
            account: registerApiResult.data,
        }));
        return registerApiResult;
    }

    const logout = async () => {
        let logoutApiResult = undefined;
        try {
            logoutApiResult = await logoutApiTrigger(state.session!).unwrap();
        } catch (e) {
            throw e;
        }
        dispatch(authenticationSlice.actions.logout({}));
        return logoutApiResult
    }

    const refreshSession = async (request: Session) => {
        const refreshSessionApiResult = await refreshSessionApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.refreshSession({
            session: refreshSessionApiResult.data,
        }));
        return refreshSessionApiResult
    }

    useEffect(() => {
        if (state.session) {
            retrieveAccount({
                id: state.session.accountId,
            }).then()
        }
    }, [retrieveAccount, state.session])

    return {
        state,
        login,
        register,
        logout,
        refreshSession,
        patchAccount,
    };
}
