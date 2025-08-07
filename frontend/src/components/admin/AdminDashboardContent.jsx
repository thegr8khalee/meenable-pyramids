// src/components/Admin/AdminDashboardContent.jsx
import React, { useEffect } from 'react';
import { useProductsStore } from '../../store/useProductsStore';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { Loader2 } from 'lucide-react';

const AdminDashboardContent = ({ setActiveSection }) => {
  const { isGettingProducts, productsCount, getProductsCount } =
    useProductsStore();
  const { getAllUsers, usersCount, getRecipes, recipes } = useAdminStore();

  useEffect(() => {
    // Fetch all necessary data on component mount
    getProductsCount();
    getAllUsers();
    getRecipes();
  }, [getProductsCount, getAllUsers, getRecipes]);

  const stats = [
    { label: 'Total Products', value: productsCount, path: 'products' },
    { label: 'Total Users', value: usersCount, path: 'users' },
    { label: 'Total Recipes', value: recipes.length, path: 'recipe' },
  ];

  const handleNavigationClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  const handleAddNewRecipe = () => {
    navigate('/admin/recipe/new');
  };

  if (isGettingProducts) {
    return (
      <div className="flex justify-center items-center p-4 min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Loading data...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="overflow-x-hidden text-3xl font-semibold mb-6 font-[inter]">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stats shadow-lg bg-base-100 rounded-none p-4"
          >
            <div className="p-5">
              <div className="stat-title text-lg">{stat.label}</div>
              <div className="stat-value text-4xl">{stat.value}</div>
            </div>
            <div className="h-full flex items-center">
              {/* Corrected onClick handler: wrapped in an arrow function */}
              <button
                className="btn btn-outline btn-primary w-full rounded-none"
                onClick={() => handleNavigationClick(stat.path)}
              >
                View
              </button>
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
          <button
            className="flex-4 btn btn-xl btn-outline btn-primary rounded-none text-lg"
            onClick={handleAddNewRecipe}
          >
            Add New Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardContent;
