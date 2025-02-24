import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/stores";
import {productSalesStatisticsSlice} from "@/src/stores/slices/productSalesStatisticsSlice";
import {productSalesStatisticsApi, ProductSalesStatisticsRequest} from "@/src/stores/apis/productSalesStatisticsApi";

export const useProductSalesStatistics = () => {
    const dispatch = useDispatch();
    const productSalesStatisticsState = useSelector(
        (state: RootState) => state.productSalesStatisticsSlice
    );

    // API hook for fetching statistics
    const getProductSalesStatisticsApiResult = productSalesStatisticsApi.useGetProductSalesStatisticsQuery(
        productSalesStatisticsState.getProductSalesStatisticsRequest
    );

    // Set filter parameters for statistics request
    const setGetProductSalesStatisticsRequest = (request: ProductSalesStatisticsRequest) => {
        dispatch(productSalesStatisticsSlice.actions.setGetProductSalesStatisticsRequest(request));
    };

    return {
        productSalesStatisticsState,
        getProductSalesStatisticsApiResult,
        setGetProductSalesStatisticsRequest,
    };
};