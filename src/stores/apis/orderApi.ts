import {createApi} from "@reduxjs/toolkit/query/react";
import {axiosBaseQuery, ManyRequest, ResponseBody} from "@/src/stores/apis";
import {ProductResponse} from "@/src/stores/apis/productApi";
import {AccountResponse} from "@/src/stores/apis/accountApi";

export interface OrderStatusResponse {
    id: string;
    status: string;
    time: Date;
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
    time: Date
}

export interface OrderResponse {
    id: string;
    account: AccountResponse
    product: ProductResponse;
    shipmentPrice: number;
    itemPrice: number;
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
    })
});
