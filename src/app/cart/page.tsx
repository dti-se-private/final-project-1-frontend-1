"use client"
import {useModal} from "@/src/hooks/useModal";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useCart} from "@/src/hooks/useCart";
import {Autocomplete, AutocompleteItem, Button, Spinner} from "@heroui/react";
import Image from "next/image";
import {convertHexStringToBase64Data} from "@/src/tools/converterTool";
import {Icon} from "@iconify/react";
import {useOrder} from "@/src/hooks/useOrder";
import {useAccountAddress} from "@/src/hooks/useAccountAddress";
import {OrderRequest, OrderResponse} from "@/src/stores/apis/orderApi";
import _ from "lodash";

export default function Page() {
    const {productId}: { productId: string } = useParams();
    const router = useRouter();
    const modal = useModal();
    const {
        orderState,
        tryCheckout
    } = useOrder();

    const {
        cartState,
        getCartApiResult,
        setCartItemsRequest,
        addCartItemRequest,
        removeCartItemRequest
    } = useCart();

    const {
        accountAddressState,
        getAccountAddressesApiResult,
        setGetAccountAddressesRequest,
    } = useAccountAddress();

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencySign: 'accounting',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    const [orderResponse, setOrderResponse] = useState<OrderResponse | undefined>(undefined);
    const [accountAddressId, setAccountAddressId] = useState<string | undefined>(undefined);
    const [isTryCheckoutFetching, setIsTryCheckoutFetching] = useState<boolean>(false);

    const handleTryCheckout = _.debounce((request) => {
        setIsTryCheckoutFetching(true);
        tryCheckout(request)
            .then((data) => {
                setOrderResponse(data.data);
            })
            .catch((error) => {
                modal.setContent({
                    header: "Try Checkout Failed",
                    body: `${error.data.message}`,
                })
                modal.onOpenChange(true);
            })
            .finally(() => {
                setIsTryCheckoutFetching(false);
            });
    }, 500)

    useEffect(() => {
        if (getCartApiResult.data?.data && accountAddressId) {
            const request: OrderRequest = {
                addressId: accountAddressId!,
                items: getCartApiResult.data?.data.map((cartItem) => ({
                    productId: cartItem.product.id,
                    quantity: cartItem.quantity
                }))
            }
            handleTryCheckout(request);
        }
    }, [accountAddressId, getCartApiResult.data?.data]);

    useEffect(() => {
        if (getAccountAddressesApiResult.data?.data) {
            setAccountAddressId(getAccountAddressesApiResult.data.data[0].id);
        }
    }, []);

    if (getCartApiResult.isLoading || getAccountAddressesApiResult.isLoading) {
        return (
            <div className="py-8 flex flex-col justify-center items-center min-h-[78vh]">
                <div className="container flex flex-row justify-center items-center gap-8 w-3/4">
                    <Spinner/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row justify-center items-center h-[79vh] h-full">
            <section
                className="p-8 md:overflow-y-scroll w-full md:w-2/3 h-full flex flex-col md:relative md:relative md:left-0 md:top-0 md:bottom-0">
                <div className="flex flex-col justify-start items-start mb-8">
                    <div className="text-6xl font-bold">Cart</div>
                    <div>All items in your cart to be checked out.</div>
                </div>
                <div className="flex flex-col gap-8 w-full h-full">
                    {getCartApiResult.data?.data?.map((cartItem, index) => (
                        <div
                            key={cartItem.id}
                            className="flex flex-row justify-between items-center md:items-center gap-4 w-full h-[12vh] md:h-[18vh] border-b border-gray-300"
                        >
                            <div className="relative h-full w-full md:w-[12vw]">
                                <Image
                                    className="rounded-md"
                                    src={
                                        cartItem.product.image
                                            ? convertHexStringToBase64Data(cartItem.product.image, "image/png")
                                            : "https://placehold.co/400x400?text=product"
                                    }
                                    layout="fill"
                                    objectFit="cover"
                                    alt='product'
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="text-lg font-bold line-clamp-1">{cartItem.product.name}</div>
                                <div
                                    className="text-md">{currencyFormatter.format(cartItem.product.price * cartItem.quantity)}</div>
                                <div
                                    className="text-md">Stock: {cartItem.product.quantity - cartItem.quantity}</div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <Button
                                    isIconOnly
                                    onPress={() => {
                                        removeCartItemRequest({
                                            productId: cartItem.product.id,
                                            quantity: 1
                                        });
                                    }}
                                >
                                    <Icon icon="heroicons:minus"/>
                                </Button>
                                <div className="flex justify-center items-center">
                                    {cartItem.quantity}
                                </div>
                                <Button
                                    isIconOnly
                                    onPress={() => {
                                        if (cartItem.product.quantity - cartItem.quantity >= 0) {
                                            addCartItemRequest({
                                                productId: cartItem.product.id,
                                                quantity: 1
                                            });
                                        }
                                    }}
                                >
                                    <Icon icon="heroicons:plus"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {getCartApiResult.data?.data?.length === 0 && (
                        <div className="flex justify-center items-center w-full h-full">
                            Empty!
                        </div>
                    )}
                </div>
            </section>

            <section
                className="w-full md:w-1/3 h-full flex md:relative md:right-0 md:top-0 md:bottom-0 md:border-l border-t border-gray-300">
                <div className="flex w-full h-full flex-col justify-between items-start p-4">
                    <div className="flex flex-col w-full">
                        <div className="mb-4 md:mb-8 text-2xl font-bold">Summary</div>
                        <div className="mb-4 flex justify-between w-full">
                            <div>Items Price</div>
                            <div>
                                {
                                    isTryCheckoutFetching ? (<Spinner size="sm"/>)
                                        : (orderResponse?.itemPrice ? currencyFormatter.format(orderResponse?.itemPrice) : "-")
                                }
                            </div>
                        </div>
                        <div className="mb-4 flex justify-between w-full">
                            <div>Shipment Price</div>
                            <div>
                                {
                                    isTryCheckoutFetching ? (<Spinner size="sm"/>)
                                        : (orderResponse?.shipmentPrice ? currencyFormatter.format(orderResponse?.shipmentPrice) : "-")
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="mb-4 flex justify-between w-full">
                            <div>Total Price</div>
                            <div>
                                {
                                    isTryCheckoutFetching ? (<Spinner size="sm"/>)
                                        : (orderResponse?.totalPrice ? currencyFormatter.format(orderResponse?.totalPrice) : "-")
                                }
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center w-full">
                            <Autocomplete
                                className="mb-6 w-full"
                                label="Address"
                                name="addressId"
                                placeholder="Type to search..."
                                inputValue={accountAddressState.getAccountAddressesRequest.search}
                                isLoading={getAccountAddressesApiResult.isFetching}
                                items={getAccountAddressesApiResult.data?.data || []}
                                onInputChange={(input) => {
                                    setGetAccountAddressesRequest({
                                        size: accountAddressState.getAccountAddressesRequest.size,
                                        page: accountAddressState.getAccountAddressesRequest.page,
                                        search: input,
                                    });
                                }}
                                onSelectionChange={(key) => {
                                    setAccountAddressId(key as string);
                                }}
                            >
                                {(item) => (
                                    <AutocompleteItem key={item.id}>
                                        {`${item.name} - Is Primary: ${item.isPrimary}`}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                            <Button
                                className="w-full"
                                color="primary"
                                onPress={() => tryCheckout({
                                    addressId: accountAddressId!,
                                    items: (getCartApiResult.data?.data ?? []).map((cartItem) => ({
                                        productId: cartItem.product.id,
                                        quantity: cartItem.quantity
                                    }))
                                })}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}