import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    authenticationApi,
    LoginByInternalRequest,
    RegisterByInternalRequest,
    Session
} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {accountApi, PatchAccountRequest} from "@/src/stores/apis/accountApi";
import {useEffect} from "react";
import {GetOneRequest} from "@/src/stores/apis";

export const useAuthentication = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.authenticationSlice);
    const [loginApiTrigger] = authenticationApi.useLazyLoginByEmailAndPasswordQuery();
    const [registerApiTrigger] = authenticationApi.useRegisterByEmailAndPasswordMutation();
    const [logoutApiTrigger] = authenticationApi.useLazyLogoutQuery();
    const [refreshSessionApiTrigger] = authenticationApi.useLazyRefreshSessionQuery();
    const [getAccountApiTrigger] = accountApi.useLazyGetAccountByIdQuery();
    const [patchAccountApiTrigger] = accountApi.usePatchOneByIdMutation();

    const getAccount = async (request: GetOneRequest) => {
        const getAccountApiResult = await getAccountApiTrigger(request).unwrap();
        const data = getAccountApiResult.data;
        if (data) {
            dispatch(authenticationSlice.actions.setAccount({
                account: data
            }));
        } else {
            dispatch(authenticationSlice.actions.setAccount({
                account: undefined,
            }));
        }
        return getAccountApiResult;
    }

    const patchAccount = async (request: PatchAccountRequest) => {
        const patchAccountApiResult = await patchAccountApiTrigger(request).unwrap();
        const data = patchAccountApiResult.data;
        if (data) {
            dispatch(authenticationSlice.actions.setAccount({
                account: data
            }));
        } else {
            dispatch(authenticationSlice.actions.setAccount({
                account: undefined,
            }));
        }
        return patchAccountApiResult;
    }

    const login = async (request: LoginByInternalRequest) => {
        const loginApiResult = await loginApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.login({
            session: loginApiResult.data,
        }));
        return loginApiResult;
    }

    const register = async (request: RegisterByInternalRequest) => {
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
            getAccount({
                id: state.session.account.id,
            }).then()
        }
    }, [state.session])

    return {
        state,
        login,
        register,
        logout,
        refreshSession,
        patchAccount,
    };
}
