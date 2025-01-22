import {Store} from "redux";

let store: Store | undefined = undefined;

const setStore = (value: Store) => {
    store = value;
}

const getStore = () => {
    return store;
}

export default {
    setStore,
    getStore
}