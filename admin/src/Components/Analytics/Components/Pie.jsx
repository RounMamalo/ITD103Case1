import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const CategoryPieChart = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/categoryquantities')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(jsonData => {
        if (jsonData.success) {
          const chartData = {
            labels: jsonData.data.map(item => item.category),
            datasets: [{
              data: jsonData.data.map(item => item.quantity),
              backgroundColor: [
                '#42c2f5',
                '#f542e6',
                '#ecf542',
              ],
            }]
          };
          setData(chartData);
        } else {
          setError('Failed to fetch data');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <Pie data={data} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CategoryPieChart;
