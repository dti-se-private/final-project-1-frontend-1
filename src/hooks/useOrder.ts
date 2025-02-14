import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {orderApi, OrderRequest} from "@/src/stores/apis/orderApi";

export const useOrder = () => {
    const dispatch = useDispatch();
    const orderState = useSelector((state: RootState) => state.orderSlice);
    const [tryCheckoutApiTrigger] = orderApi.useTryCheckoutMutation();
    const [checkoutApiTrigger] = orderApi.useCheckoutMutation();

    const tryCheckout = async (request: OrderRequest) => {
        const tryCheckoutApiResult = await tryCheckoutApiTrigger(request).unwrap();
        return tryCheckoutApiResult;
    }

    const checkout = async (request: OrderRequest) => {
        const checkoutApiResult = await checkoutApiTrigger(request).unwrap();
        return checkoutApiResult;
    }
    return {
        orderState,
        tryCheckout,
        checkout
    };
}
