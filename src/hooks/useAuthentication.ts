import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    authenticationApi,
    LoginByExternalRequest,
    LoginByInternalRequest,
    RegisterByExternalRequest,
    RegisterByInternalRequest,
    Session
} from "@/src/stores/apis/authenticationApi";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {accountApi, PatchAccountRequest} from "@/src/stores/apis/accountApi";
import {useEffect} from "react";
import {OneRequest, ResponseBody} from "@/src/stores/apis";

export const useAuthentication = () => {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.authenticationSlice);
    const [loginByInternalApiTrigger] = authenticationApi.useLoginByInternalMutation();
    const [registerByInternalApiTrigger] = authenticationApi.useRegisterByInternalMutation();
    const [loginByExternalApiTrigger] = authenticationApi.useLoginByExternalMutation();
    const [registerByExternalApiTrigger] = authenticationApi.useRegisterByExternalMutation();
    const [logoutApiTrigger] = authenticationApi.useLogoutMutation();
    const [refreshSessionApiTrigger] = authenticationApi.useRefreshSessionMutation();
    const [getAccountApiTrigger] = accountApi.useLazyGetAccountQuery();
    const [patchAccountApiTrigger] = accountApi.usePatchAccountMutation();

    const getAccount = async (request: OneRequest) => {
        const getAccountApiResult = await getAccountApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.setAccount({
            account: getAccountApiResult.data
        }));
    }

    const patchAccount = async (request: PatchAccountRequest) => {
        const patchAccountApiResult = await patchAccountApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.setAccount({
            account: patchAccountApiResult.data
        }));
        return patchAccountApiResult;
    }

    const loginByInternal = async (request: LoginByInternalRequest) => {
        const loginByInternalApiResult = await loginByInternalApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.login({
            session: loginByInternalApiResult.data,
        }));
        return loginByInternalApiResult;
    }

    const registerByInternal = async (request: RegisterByInternalRequest) => {
        const registerByInternalApiResult = await registerByInternalApiTrigger(request).unwrap();
        return registerByInternalApiResult;
    }

    const loginByExternal = async (request: LoginByExternalRequest) => {
        const loginByExternalApiResult = await loginByExternalApiTrigger(request).unwrap();
        dispatch(authenticationSlice.actions.login({
            session: loginByExternalApiResult.data,
        }));
        return loginByExternalApiResult;
    }

    const registerByExternal = async (request: RegisterByExternalRequest) => {
        const registerByExternalApiResult = await registerByExternalApiTrigger(request).unwrap();
        return registerByExternalApiResult;
    }

    const logout = async () => {
        let logoutApiResult: ResponseBody<null>;
        try {
            logoutApiResult = await logoutApiTrigger(state.session!).unwrap();
        } catch (error) {
            const result = error as { status: string, message: string, data: never };
            logoutApiResult = {
                message: result.message,
                data: null,
            }
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
        loginByInternal,
        registerByInternal,
        loginByExternal,
        registerByExternal,
        logout,
        refreshSession,
        patchAccount,
    };
}
