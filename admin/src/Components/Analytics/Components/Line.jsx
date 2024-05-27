import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const UserRegistrationsChart = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/userregistrations');
                const data = response.data.data;

                if (data && Array.isArray(data)) {
                    const dates = data.map(entry => entry.date);
                    const userCounts = data.map(entry => entry.userCount);

                    setChartData({
                        labels: dates,
                        datasets: [
                            {
                                label: 'User Registrations',
                                data: userCounts,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                fill: true
                            }
                        ]
                    });
                } else {
                    setError('Data format is incorrect');
                }
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Line data={chartData} />
        </div>
    );
};

export default UserRegistrationsChart;
