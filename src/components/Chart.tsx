import {FC} from "react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';
import {StatisticSeriesResponse} from "@/src/stores/apis/productSalesStatisticsApi";

interface ChartProps {
    data: StatisticSeriesResponse[];
    aggregation: string;
    period: string;
}

export const Chart: FC<ChartProps> = ({data, aggregation, period}) => (
    <BarChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis
            dataKey="label"
            label={{
                value: period.charAt(0).toUpperCase() + period.slice(1),
                position: 'bottom'
            }}
        />
        <YAxis
            label={{
                value: aggregation.charAt(0).toUpperCase() + aggregation.slice(1),
                angle: -90,
                position: 'insideLeft'
            }}
        />
        <Tooltip/>
        <Legend/>
        <Bar
            dataKey="value"
            fill="#8884d8"
            name={`Sales (${aggregation} - ${period})`}
        />
    </BarChart>
);