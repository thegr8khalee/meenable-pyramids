// src/components/Admin/AdminDashboardContent.jsx
import React, { useEffect } from 'react';
import { useProductsStore } from '../../store/useProductsStore';
// import { useCollectionStore } from '../../store/useCollectionStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboardContent = () => {
  // In a real application, you would fetch these stats from your backend
  const { isGettingProducts, productsCount, getProductsCount } =
    useProductsStore();

  useEffect(() => {
    getProductsCount();
  }, [getProductsCount]);

  const stats = [{ label: 'Total Products', value: productsCount }];

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  // const handleAddNewC = () => {
  //   navigate('/admin/collections/new');
  // };

  if (isGettingProducts) {
    // Show a loading indicator while authentication status is being determined
    return <div className="text-center p-4">Loading Data...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 font-[inter]">Dashboard Overview</h2>
      <div className="grid grid-cols-1 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stats shadow-lg bg-base-100 rounded-none p-4"
          >
            <div className="stat">
              <div className="stat-title text-lg">{stat.label}</div>
              <div className="stat-value text-4xl">{stat.value}</div>
              {/* <div className="stat-desc">21% more than last month</div> */}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 text-secondary">
          Quick Actions
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-4 btn btn-xl btn-outline btn-primary rounded-none text-lg"
            onClick={handleAddNew}
          >
            Add New Product
          </button>
          {/* <button
            className="flex-4 btn btn-xl btn-outline btn-primary rounded-full text-lg"
            onClick={handleAddNewC}
          >
            Add New Collection
          </button> */}
          {/* <button className="flex-4 btn btn-xl btn-outline btn-primary rounded-full text-lg">
            View All Orders
          </button>
          <button className="flex-4 btn btn-xl btn-outline btn-primary rounded-full text-lg">
            Manage Reviews
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
