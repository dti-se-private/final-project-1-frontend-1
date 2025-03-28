import type {BaseQueryFn} from '@reduxjs/toolkit/query'
import type {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import axios from 'axios'
import {authenticationSlice, AuthenticationState} from "@/src/stores/slices/authenticationSlice";
import storeRegistry from "@/src/registries/storeRegistry";
import applyCaseMiddleware from "axios-case-converter";
import {Session} from "@/src/stores/apis/authenticationApi";
import {pathPatternPermissions} from "@/src/components/PermissionProvider";

export interface ResponseBody<T> {
    data?: T;
    message: string;
}

export interface OneRequest {
    id: string;
}

export interface ManyRequest {
    page: number;
    size: number;
    search: string;
}

export const axiosBaseQuery =
    (
        {baseUrl}: { baseUrl: string } = {baseUrl: ''}
    ): BaseQueryFn<
        {
            url: string
            method?: AxiosRequestConfig['method']
            data?: AxiosRequestConfig['data']
            params?: AxiosRequestConfig['params']
            headers?: AxiosRequestConfig['headers']
        },
        unknown,
        unknown
    > =>
        async ({url, method, data, params, headers}, api, extraOptions) => {
            const instance = applyCaseMiddleware(axios.create())
            const rawInstance = applyCaseMiddleware(axios.create())
            const store = storeRegistry.getStore()!
            const authenticationState: AuthenticationState = store.getState().authenticationSlice
            instance.interceptors.request.use(
                async config => {
                    if (authenticationState.session?.accessToken) {
                        config.headers.Authorization = `Bearer ${authenticationState.session.accessToken}`
                    }
                    return config
                }
            )
            instance.interceptors.response.use(
                response => {
                    return response
                },
                async error => {
                    if (error.response.status === 401) {
                        if (authenticationState.session) {
                            const refreshSessionResponse: AxiosResponse<ResponseBody<Session>> = await rawInstance.request(
                                {
                                    url: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/authentications/refreshes/session`,
                                    method: 'POST',
                                    data: authenticationState.session,
                                }
                            )
                            if (refreshSessionResponse.status === 200 && refreshSessionResponse.data.data) {
                                store.dispatch(authenticationSlice.actions.refreshSession({session: refreshSessionResponse.data.data}))
                                error.config.headers.Authorization = `Bearer ${refreshSessionResponse.data.data.accessToken}`
                                return await rawInstance(error.config)
                            } else {
                                store.dispatch(authenticationSlice.actions.logout({}))
                                window.location.href = '/login'
                            }
                        } else {
                            store.dispatch(authenticationSlice.actions.logout({}))
                            const currentPath = window.location.pathname;
                            const isPathAllowed = pathPatternPermissions.UNAUTHENTICATED.some(pathPattern => new RegExp(pathPattern).test(currentPath))
                            if (!isPathAllowed) {
                                window.location.href = '/login'
                            }
                        }
                    }
                    return await Promise.reject(error)
                }
            )

            try {
                const result = await instance.request({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers
                });
                return {
                    data: result.data
                }
            } catch (axiosError) {
                const err = axiosError as AxiosError
                return {
                    error: {
                        status: err.response?.status,
                        message: err.message,
                        data: err.response?.data,
                    }
                }
            }
        }
