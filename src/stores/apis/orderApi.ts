import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, OneRequest, ResponseBody} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {AccountResponse} from "@/src/stores/apis/accountApi";

export interface OrderStatusResponse {
    id: string;
    status: string;
    time: string;
}

export interface OrderItemResponse {
    id: string;
    product: ProductResponse;
    quantity: number;
}

export interface PaymentProofResponse {
    id: string;
    file: string;
    extension: string;
    time: string;
}

export interface PaymentProofRequest {
    file: string;
    extension: string;
}

export interface OrderResponse {
    id: string;
    account: AccountResponse
    itemPrice: number;
    shipmentPrice: number;
    totalPrice: number;
    statuses: OrderStatusResponse[];
    items: OrderItemResponse[];
    paymentProofs: PaymentProofResponse[];
    shipmentOrigin: string
    shipmentDestination: string
}


export interface OrderItemRequest {
    productId: string;
    quantity: number;
}

export interface OrderRequest {
    addressId: string;
    items: OrderItemRequest[];
}

export interface ManualPaymentProcessRequest {
    orderId: string;
    paymentProofs: PaymentProofRequest[];
}

export interface OrderProcessRequest {
    orderId: string;
    action: string;
}

export interface PaymentGatewayRequest {
    orderId: string;
}

export interface PaymentGatewayResponse {
    url: string;
}

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_1_URL}/orders`
    }),
    endpoints: (builder) => ({
        getOrders: builder.query<ResponseBody<OrderResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`
                ];
                const result = await baseQuery({
                    url: `?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse[]>};
            }
        }),
        getOrder: builder.query<ResponseBody<OrderResponse>, OneRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: `/${args.id}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        getPaymentConfirmationOrders: builder.query<ResponseBody<OrderResponse[]>, ManyRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const queryParams = [
                    `page=${args.page}`,
                    `size=${args.size}`,
                    `search=${args.search}`
                ];
                const result = await baseQuery({
                    url: `/payment-confirmations?${queryParams.join("&")}`,
                    method: "GET"
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse[]>};
            }
        }),
        tryCheckout: builder.mutation<ResponseBody<OrderResponse>, OrderRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/try-checkout",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        checkout: builder.mutation<ResponseBody<OrderResponse>, OrderRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/checkout",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        processManualPayment: builder.mutation<ResponseBody<OrderResponse>, ManualPaymentProcessRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/manual-payments/process",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        processPaymentConfirmation: builder.mutation<ResponseBody<OrderResponse>, OrderProcessRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/payment-confirmations/process",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        processShipmentConfirmation: builder.mutation<ResponseBody<OrderResponse>, OrderProcessRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/shipment-confirmations/process",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        processCancellation: builder.mutation<ResponseBody<OrderResponse>, OrderProcessRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/cancellations/process",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<OrderResponse>};
            }
        }),
        processPaymentGateway: builder.mutation<ResponseBody<PaymentGatewayResponse>, PaymentGatewayRequest>({
            queryFn: async (args, api, extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: "/payment-gateways/process",
                    method: "POST",
                    data: args,
                });
                if (result.error) {
                    return {error: result.error};
                }
                return {data: result.data as ResponseBody<PaymentGatewayResponse>};
            }
        }),
    })
});
