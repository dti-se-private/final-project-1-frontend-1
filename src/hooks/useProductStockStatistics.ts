import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/stores";
import { productStockStatisticsSlice } from "@/src/stores/slices/productStockStatisticsSlice";
import {
  productStockStatisticsApi,
  ProductStockStatisticsRequest,
  StatisticSeriesResponse
} from "@/src/stores/apis/productStockStatisticsApi";

export const useProductStockStatistics = () => {
  const dispatch = useDispatch();
  const productStockStatisticsState = useSelector(
    (state: RootState) => state.productStockStatisticsSlice
  );

  // API hook for fetching stock statistics
  const getProductStockStatisticsApiResult = productStockStatisticsApi.useGetProductStockStatisticsQuery(
    productStockStatisticsState.getProductStockStatisticsRequest
  );

  // Set filter parameters for statistics request
  const setGetProductStockStatisticsRequest = (request: ProductStockStatisticsRequest) => {
    dispatch(productStockStatisticsSlice.actions.setGetProductStockStatisticsRequest(request));
  };

  return {
    productStockStatisticsState,
    getProductStockStatisticsApiResult,
    setGetProductStockStatisticsRequest,
  };
};