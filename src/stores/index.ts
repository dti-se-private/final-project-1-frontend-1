import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {setupListeners} from "@reduxjs/toolkit/query";
import {landingSlice} from "@/src/stores/slices/landingSlice";
import {modalSlice} from "@/src/stores/slices/modalSlice";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {authenticationApi} from "@/src/stores/apis/authenticationApi";
import {accountApi} from "@/src/stores/apis/accountApi";
import {productApi} from "@/src/stores/apis/productApi";
import storeRegistry from "@/src/registries/storeRegistry";
import {searchSlice} from "@/src/stores/slices/searchSlice";
import {searcherSlice} from "@/src/stores/slices/searcherSlice";
import {statisticApi} from "@/src/stores/apis/statisticApi";
import {verificationApi} from "@/src/stores/apis/verificationApi";
import {accountAddressApi} from "@/src/stores/apis/addressApi";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";

const rootReducer = combineReducers({
    [authenticationSlice.reducerPath]: authenticationSlice.reducer,
    [landingSlice.reducerPath]: landingSlice.reducer,
    [searcherSlice.reducerPath]: searcherSlice.reducer,
    [searchSlice.reducerPath]: searchSlice.reducer,
    [modalSlice.reducerPath]: modalSlice.reducer,
    [accountAddressSlice.reducerPath]: accountAddressSlice.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [accountAddressApi.reducerPath]: accountAddressApi.reducer,
    [verificationApi.reducerPath]: verificationApi.reducer,
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [statisticApi.reducerPath]: statisticApi.reducer,
})

const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value)
        },
        removeItem(_key: string) {
            return Promise.resolve()
        },
    }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()
const persistedReducer = persistReducer({
        key: "persistence",
        whitelist: [authenticationSlice.reducerPath],
        storage,
    },
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            ignoredPaths: [modalSlice.reducerPath],
        },
    }).concat(
        productApi.middleware,
        verificationApi.middleware,
        authenticationApi.middleware,
        accountApi.middleware,
        accountAddressApi.middleware,
        statisticApi.middleware,
    ),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

storeRegistry.setStore(store);

