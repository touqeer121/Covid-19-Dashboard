import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import zoom from 'chartjs-plugin-zoom'
import { fetchDailyData } from '../../api';

import styles from './Chart.module.css';

const Chart = ({ data: { confirmed, recovered, deaths }, country, chartType , provinceState, fromDate, toDate}) => {
  const [dailyData, setDailyData] = useState({});
  useEffect(() => {
    const fetchMyAPI = async () => {
      const initialDailyData = await fetchDailyData(country, fromDate, toDate);
      setDailyData(initialDailyData);
    };
    fetchMyAPI();
  }, [country, fromDate, toDate]);

  const changeFromDate = ()=>{

  }
  const barChart = (
    confirmed ? (
      <Bar
        data={{
          labels: ['Infected', 'Recovered', 'Deaths'],
          datasets: [
            {
              label: 'People',
              backgroundColor: ['rgba(0, 0, 255, .8)', 'rgba(0, 255, 0, 0.8)', 'rgba(255, 0, 0, 0.8)'],
              data: [confirmed.value, recovered.value, deaths.value],
            },
          ],
        }}
        height={50}
        width={100}
        options={{
          legend: { display: false },
          title: { display: true, text: (provinceState ? (`Current state in ${provinceState}`) :(country ? `Current state in ${country}` : `Current state in the World` ))},
        }}
      />
    ) : null
  );

  const lineChart = (
    dailyData[0] ? (
      <Line
        data={{
          labels: dailyData.map(({ date }) => date),
          datasets: [{
            data: dailyData.map((data) => data.confirmed),
            label: 'Infected',
            borderColor: '#3333ff',
            fill: false,
          }, 
          {
            data: dailyData.map((data) => data.recovered),
            label: 'Recovered',
            borderColor: 'Green',
            backgroundColor: 'rgba(0, 40, 0, 0.3)',
            fill: false,
          },
          {
            data: dailyData.map((data) => data.deaths),
            label: 'Deaths',
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            fill: false,
          },
          ],
        }}

        height={50}
        width={100}
        options={{
            scales: {
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0.1)",
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0.1)",
                }
            }]
            }
        }}
      />
    ) : null
  );

  return (
    <div className={styles.container}>
      {chartType == 'bar' ? barChart : lineChart}
    </div>
  );
};

export default Chart;
