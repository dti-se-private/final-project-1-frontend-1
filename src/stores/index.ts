import {combineReducers} from "redux";
import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import {setupListeners} from "@reduxjs/toolkit/query";
import {categorySlice} from "@/src/stores/slices/categorySlice";
import {modalSlice} from "@/src/stores/slices/modalSlice";
import {productSlice} from "@/src/stores/slices/productSlice";
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
import {warehouseSlice} from "@/src/stores/slices/warehouseSlice";
import {warehouseApi} from "@/src/stores/apis/warehouseApi";
import {warehouseAdminSlice} from "@/src/stores/slices/warehouseAdminSlice";
import {warehouseAdminApi} from "@/src/stores/apis/warehouseAdminApi";
import {warehouseProductSlice} from "@/src/stores/slices/warehouseProductSlice";
import {warehouseProductApi} from "@/src/stores/apis/warehouseProductApi";
import {warehouseLedgerSlice} from "@/src/stores/slices/warehouseLedgerSlice";
import {warehouseLedgerApi} from "@/src/stores/apis/warehouseLedgerApi";

const rootReducer = combineReducers({
    [authenticationSlice.reducerPath]: authenticationSlice.reducer,
    [categorySlice.reducerPath]: categorySlice.reducer,
    [modalSlice.reducerPath]: modalSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
    [accountAddressSlice.reducerPath]: accountAddressSlice.reducer,
    [cartSlice.reducerPath]: cartSlice.reducer,
    [orderSlice.reducerPath]: orderSlice.reducer,
    [warehouseSlice.reducerPath]: warehouseSlice.reducer,
    [warehouseAdminSlice.reducerPath]: warehouseAdminSlice.reducer,
    [warehouseProductSlice.reducerPath]: warehouseProductSlice.reducer,
    [warehouseLedgerSlice.reducerPath]: warehouseLedgerSlice.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [accountAddressApi.reducerPath]: accountAddressApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    [warehouseAdminApi.reducerPath]: warehouseAdminApi.reducer,
    [warehouseProductApi.reducerPath]: warehouseProductApi.reducer,
    [warehouseLedgerApi.reducerPath]: warehouseLedgerApi.reducer,
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
        warehouseApi.middleware,
        warehouseAdminApi.middleware,
        warehouseProductApi.middleware,
        warehouseLedgerApi.middleware,
        statisticApi.middleware,
    ),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

storeRegistry.setStore(store);

