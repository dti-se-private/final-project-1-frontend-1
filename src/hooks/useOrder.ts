import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {orderApi, OrderRequest, OrderResponse, PaymentGatewayRequest} from "@/src/stores/apis/orderApi";
import {orderSlice} from "@/src/stores/slices/orderSlice";
import {ManyRequest} from "@/src/stores/apis";

export const useOrder = () => {
    const dispatch = useDispatch();
    const orderState = useSelector((state: RootState) => state.orderSlice);
    const [tryCheckoutApiTrigger] = orderApi.useTryCheckoutMutation();
    const [checkoutApiTrigger] = orderApi.useCheckoutMutation();
    const getOrdersApiResult = orderApi.useGetOrdersQuery(orderState.getOrdersRequest);
    const [processPaymentGatewayApiTrigger] = orderApi.useProcessPaymentGatewayMutation();

    const tryCheckout = async (request: OrderRequest) => {
        const tryCheckoutApiResult = await tryCheckoutApiTrigger(request).unwrap();
        return tryCheckoutApiResult;
    }

    const checkout = async (request: OrderRequest) => {
        const checkoutApiResult = await checkoutApiTrigger(request).unwrap();
        return checkoutApiResult;
    }

    const setGetOrdersRequest = (request: ManyRequest) => {
        dispatch(orderSlice.actions.setGetOrdersRequest(request));
        getOrdersApiResult.refetch();
    }

    const setDetails = (order: OrderResponse) => {
        dispatch(orderSlice.actions.setDetails(order));
    }

    const processPaymentGateway = async (request: PaymentGatewayRequest) => {
        const processPaymentGatewayApiResult = await processPaymentGatewayApiTrigger(request).unwrap();
        return processPaymentGatewayApiResult;
    }

    return {
        orderState,
        tryCheckout,
        checkout,
        getOrdersApiResult,
        setGetOrdersRequest,
        setDetails,
        processPaymentGateway
    };
}
