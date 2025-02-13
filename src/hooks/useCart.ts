import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productSlice} from "@/src/stores/slices/productSlice";
import {ManyRequest} from "@/src/stores/apis";
import {cartApi, CartItemRequest} from "@/src/stores/apis/cartApi";

export const useCart = () => {
    const dispatch = useDispatch();

    const cartState = useSelector((state: RootState) => state.cartSlice);

    const getCartApiResult = cartApi.useGetCartItemsQuery({
        page: cartState.getCartItemsRequest.page,
        size: cartState.getCartItemsRequest.size,
        search: cartState.getCartItemsRequest.search
    });

    const [addCartItemApiTrigger] = cartApi.useAddCartItemMutation();
    const [removeCartItemApiTrigger] = cartApi.useRemoveCartItemMutation();


    const setCartItemsRequest = (request: ManyRequest) => {
        dispatch(productSlice.actions.setGetProductsRequest(request));
    }

    const addCartItemRequest = async (request: CartItemRequest) => {
        const addCartItemApiResult = await addCartItemApiTrigger(request).unwrap();
        getCartApiResult.refetch();
        return addCartItemApiResult;
    }

    const removeCartItemRequest = async (request: CartItemRequest) => {
        const removeCartItemApiResult = await removeCartItemApiTrigger(request).unwrap();
        getCartApiResult.refetch();
        return removeCartItemApiResult;
    }

    return {
        cartState,
        getCartApiResult,
        setCartItemsRequest,
        addCartItemRequest,
        removeCartItemRequest,
    };
}
