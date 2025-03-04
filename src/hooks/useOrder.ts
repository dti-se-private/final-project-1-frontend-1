import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {
    ManualPaymentProcessRequest,
    orderApi,
    OrderProcessRequest,
    OrderRequest,
    OrderResponse,
    PaymentGatewayRequest
} from "@/src/stores/apis/orderApi";
import {orderSlice} from "@/src/stores/slices/orderSlice";
import {ManyRequest} from "@/src/stores/apis";

export const useOrder = () => {
    const dispatch = useDispatch();
    const orderState = useSelector((state: RootState) => state.orderSlice);
    const [tryCheckoutApiTrigger] = orderApi.useTryCheckoutMutation();
    const [checkoutApiTrigger] = orderApi.useCheckoutMutation();
    const getOrdersApiResult = orderApi.useGetOrdersQuery(orderState.getOrdersRequest);
    const getPaymentConfirmationOrdersApiResult = orderApi.useGetPaymentConfirmationOrdersQuery(orderState.getPaymentConfirmationOrdersRequest);
    const getShipmentStartConfirmationOrdersApiResult = orderApi.useGetShipmentStartConfirmationOrdersQuery(orderState.getShipmentStartConfirmationOrdersRequest);
    const [processCancellationApiTrigger] = orderApi.useProcessCancellationMutation();
    const [processPaymentGatewayApiTrigger] = orderApi.useProcessPaymentGatewayMutation();
    const [processManualPaymentApiTrigger] = orderApi.useProcessManualPaymentMutation();
    const [processPaymentConfirmationApiTrigger] = orderApi.useProcessPaymentConfirmationMutation();
    const [processShipmentStartConfirmationApiTrigger] = orderApi.useProcessShipmentStartConfirmationMutation();
    const [processShipmentConfirmationApiTrigger] = orderApi.useProcessShipmentConfirmationMutation();

    const tryCheckout = async (request: OrderRequest) => {
        const tryCheckoutApiResult = await tryCheckoutApiTrigger(request).unwrap();
        return tryCheckoutApiResult;
    }

    const checkout = async (request: OrderRequest) => {
        const checkoutApiResult = await checkoutApiTrigger(request).unwrap();
        return checkoutApiResult;
    }

    const setGetPaymentConfirmationOrdersRequest = (request: ManyRequest) => {
        dispatch(orderSlice.actions.setGetPaymentConfirmationOrdersRequest(request));
        getPaymentConfirmationOrdersApiResult.refetch();
    }

    const setGetShipmentStartConfirmationOrdersRequest = (request: ManyRequest) => {
        dispatch(orderSlice.actions.setGetShipmentStartConfirmationOrdersRequest(request));
        getShipmentStartConfirmationOrdersApiResult.refetch();
    }

    const setGetOrdersRequest = (request: ManyRequest) => {
        dispatch(orderSlice.actions.setGetOrdersRequest(request));
        getOrdersApiResult.refetch();
    }

    const setDetails = (order: OrderResponse) => {
        dispatch(orderSlice.actions.setDetails(order));
    }

    const processCancellation = async (request: OrderProcessRequest) => {
        const processCancellationApiResult = await processCancellationApiTrigger(request).unwrap();
        getOrdersApiResult.refetch();
        return processCancellationApiResult;
    }

    const processPaymentGateway = async (request: PaymentGatewayRequest) => {
        const processPaymentGatewayApiResult = await processPaymentGatewayApiTrigger(request).unwrap();
        getOrdersApiResult.refetch();
        return processPaymentGatewayApiResult;
    }

    const processManualPayment = async (request: ManualPaymentProcessRequest) => {
        const processManualPaymentApiResult = await processManualPaymentApiTrigger(request).unwrap();
        getOrdersApiResult.refetch();
        return processManualPaymentApiResult;
    }

    const processPaymentConfirmation = async (request: OrderProcessRequest) => {
        const processPaymentConfirmationApiResult = await processPaymentConfirmationApiTrigger(request).unwrap();
        getPaymentConfirmationOrdersApiResult.refetch();
        return processPaymentConfirmationApiResult;
    }

    const processShipmentStartConfirmation = async (request: OrderProcessRequest) => {
        const processShipmentStartConfirmationApiResult = await processShipmentStartConfirmationApiTrigger(request).unwrap();
        getShipmentStartConfirmationOrdersApiResult.refetch();
        return processShipmentStartConfirmationApiResult;
    }

    const processShipmentConfirmation = async (request: OrderProcessRequest) => {
        const processShipmentConfirmationApiResult = await processShipmentConfirmationApiTrigger(request).unwrap();
        getOrdersApiResult.refetch();
        return processShipmentConfirmationApiResult;
    }


    return {
        orderState,
        getOrdersApiResult,
        setGetOrdersRequest,
        getPaymentConfirmationOrdersApiResult,
        setGetPaymentConfirmationOrdersRequest,
        getShipmentStartConfirmationOrdersApiResult,
        setGetShipmentStartConfirmationOrdersRequest,
        tryCheckout,
        checkout,
        setDetails,
        processCancellation,
        processPaymentGateway,
        processManualPayment,
        processPaymentConfirmation,
        processShipmentStartConfirmation,
        processShipmentConfirmation
    };
}
