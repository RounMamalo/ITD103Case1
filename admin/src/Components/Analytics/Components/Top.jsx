import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopProducts = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/topproducts');
                setTopProducts(response.data.data);
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
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {topProducts.map(product => (
                    <li key={product.id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
                        <div>
                            <h3>{product.name}</h3>
                            <p>Category: {product.category}</p>
                            <p>Added to cart: {product.count} times</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopProducts;
