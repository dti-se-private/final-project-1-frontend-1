import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {setupListeners} from "@reduxjs/toolkit/query";
import {productSlice} from "@/src/stores/slices/productSlice";
import {modalSlice} from "@/src/stores/slices/modalSlice";
import {authenticationSlice} from "@/src/stores/slices/authenticationSlice";
import {authenticationApi} from "@/src/stores/apis/authenticationApi";
import {accountApi} from "@/src/stores/apis/accountApi";
import {categoryApi} from "@/src/stores/apis/categoryApi";
import {productApi} from "@/src/stores/apis/productApi";
import {cartApi} from "@/src/stores/apis/cartApi";
import {orderApi} from "@/src/stores/apis/orderApi";
import {cartSlice} from "@/src/stores/slices/cartSlice";
import {orderSlice} from "@/src/stores/slices/orderSlice";
import storeRegistry from "@/src/registries/storeRegistry";
import {statisticApi} from "@/src/stores/apis/statisticApi";
import {verificationApi} from "@/src/stores/apis/verificationApi";
import {accountAddressApi} from "@/src/stores/apis/accountAddressApi";
import {accountAddressSlice} from "@/src/stores/slices/accountAddressSlice";

const rootReducer = combineReducers({
    [authenticationSlice.reducerPath]: authenticationSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
    [modalSlice.reducerPath]: modalSlice.reducer,
    [accountAddressSlice.reducerPath]: accountAddressSlice.reducer,
    [cartSlice.reducerPath]: cartSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [accountAddressApi.reducerPath]: accountAddressApi.reducer,
    [verificationApi.reducerPath]: verificationApi.reducer,
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
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
        categoryApi.middleware,
        cartApi.middleware,
        orderApi.middleware,
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

