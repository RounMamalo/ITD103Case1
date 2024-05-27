import React from 'react'
import "./Analytics.css"
import CategoryPieChart from './Components/Pie'
import UserRegistrationsChart from './Components/Line'
import TopProducts from './Components/Top'
export const Analytics = () => {
  return (
    <div className='main-body'> 
      <h1>Analytics</h1>

      <div className="data-anayltics">
        <div className="pie-category-quantity chart">
          <h3>Most Added to Cart Items (by Category)</h3>
          <CategoryPieChart  />
        </div>

        <div className="line-category-quantity chart">
          <h3>User Trend (Over the last 7 Days)</h3>
          <UserRegistrationsChart />
        </div>

        <div className="top-category chart">
          <h3>Top 3 Best-Selling Products</h3>
          <div className="top-chart">
            <TopProducts  className="line-chart" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics


