/* eslint-disable no-unused-vars */
// src/pages/RecipePage.jsx
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ShoppingCart,
  Pen,
  Trash2,
  ChevronLeft,
  Share2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useAdminStore } from '../store/useAdminStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/UseCartStore';

import whatsapp from '../images/whatsapp.webp';

const RecipePage = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const {
    recipe,
    getRecipeById,
    isGettingRecipe,
    isDeletingRecipe,
    deleteRecipe,
  } = useAdminStore();
  const { isAdmin } = useAuthStore();
  const { addRecipeToCart, isAddingToCart } = useCartStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch recipe details when component mounts or recipeId changes
  useEffect(() => {
    if (recipeId) {
      getRecipeById(recipeId);
    }
  }, [recipeId, getRecipeById]);

  console.log(recipe);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src =
      'https://placehold.co/600x400/E0E0E0/333333?text=No+Image+Available';
  };

  // Admin action handlers
  const handleEditRecipe = (id) => {
    navigate(`/admin/recipe/edit/${id}`);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteRecipe = async (id) => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    await deleteRecipe(recipeId);
    toast.success('Recipe deleted successfully!');
    navigate(-1);
  };

  // Other handlers
  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy link.');
      });
  };

  const handleAddToCart = () => {
    if (recipe) {
      addRecipeToCart(recipe);
    }
  };

  // WhatsApp link generator
  const whatsappNumber = '2348066258729'; // Your actual WhatsApp number
  const productLink = (id) => `${window.location.origin}/recipes/${id}`;
  const fullMessage = (recipeData) =>
    encodeURIComponent(
      `I'm interested in the ingredients for this recipe: ${recipeData.name}.\n` +
        `Estimated Price: N${Number(recipeData.price).toFixed(2)}.\n` +
        `Link: ${productLink(recipeData._id)}`
    );
  const whatsappHref = (recipeData) =>
    `https://wa.me/${whatsappNumber}?text=${fullMessage(recipeData)}`;

  const [activeTab, setActiveTab] = useState('ingredients');

  // Loading state
  if (isGettingRecipe) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading recipe details...</p>
      </div>
    );
  }

  // Error state (e.g., recipe not found)
  if (!recipe && !isGettingRecipe) {
    return (
      <div className="text-center text-xl text-gray-600 mt-16">
        Recipe not found.
        <button
          onClick={() => navigate('/recipes')}
          className="btn btn-sm btn-primary ml-4"
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  // Main Recipe Display
  return (
    <div>
      <div className="md:hidden items-center flex flex-col">
        <div className="w-full flex justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle mx-4 mt-2"
          >
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleShare} className="btn btn-circle mx-4 mt-2">
            <Share2 size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full pb-4">
          {/* Recipe Image */}
          <div className="flex flex-col items-center w-full">
            <div className="relative h-[45vh] w-full  rounded-none overflow-hidden flex items-center justify-center">
              {recipe.image ? (
                <img
                  src={recipe.image.url}
                  alt={recipe.name}
                  className=" h-full rounded-none"
                  onError={handleImageError}
                />
              ) : (
                <img
                  src="https://placehold.co/600x400/E0E0E0/333333?text=No+Image+Available"
                  alt="No Image Available"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {recipe.isRecipeOfTheDay && (
                <span className="rounded-full absolute top-2 left-3 badge badge-success font-[poppins] text-white ">
                  Recipe of the Day
                </span>
              )}
            </div>
          </div>

          {/* Recipe Details */}
          <div className=" space-y-2">
            <h1 className="text-3xl font-bold font-[poppins] capitalize">
              {recipe.name}
            </h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-red-600 font-bold text-xl">
                ₦
                {Number(recipe.price).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {!isAdmin ? (
              <div className="space-y-4 pt-4">
                <a
                  className="btn bg-green-500 text-base-100 w-full rounded-none font-[inter] shadow-none border-0"
                  href={whatsappHref(recipe)}
                >
                  <img src={whatsapp} alt="WhatsApp" className="size-6" />
                  Order Ingredients
                </a>
                <button
                  className="btn btn-primary text-white w-full rounded-none border-none shadow-none font-[poppins]"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  Add Ingredients to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4">
                <button
                  className="btn rounded-none border-none text-white bg-primary mr-2 w-full"
                  onClick={() => handleEditRecipe(recipe._id)}
                >
                  <Pen /> Edit Recipe
                </button>
                <button
                  className="btn rounded-none border-none shadow-none w-full btn-error"
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  disabled={isDeletingRecipe}
                >
                  {isDeletingRecipe ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}{' '}
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full mt-4">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-300 justify-center">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 font-[inter] transition-colors duration-300 ${
                activeTab === 'ingredients'
                  ? 'border-b-2 border-primary font-bold text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 font-[inter] transition-colors duration-300 ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary font-bold text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Description
            </button>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            {activeTab === 'ingredients' && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose text-gray-700">
                  <h3 className="font-medium">Ingredients</h3>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((item, index) => (
                        <li key={index} className="capitalize">
                          {item.name}
                        </li>
                      ))
                    ) : (
                      <li>No ingredients listed.</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            )}
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold">Description</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: recipe.description }}
                ></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
              <p className="mb-6">
                This action will permanently delete this recipe.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-error text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden items-center md:flex flex-col">
        <div className="w-full flex justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-circle mx-4 mt-2"
          >
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleShare} className="btn btn-circle mx-4 mt-2">
            <Share2 size={20} />
          </button>
        </div>

        <div className="flex gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full pb-4">
          {/* Recipe Image */}
          <div className="flex flex-col items-center h-[50vh] lg:h-[60vh] w-[50vw]">
            <div className="relative  w-full h-full  rounded-none overflow-hidden flex items-center justify-center">
              {recipe.image ? (
                <img
                  src={recipe.image.url}
                  alt={recipe.name}
                  className="w-full object-cover h-full rounded-none"
                  onError={handleImageError}
                />
              ) : (
                <img
                  src="https://placehold.co/600x400/E0E0E0/333333?text=No+Image+Available"
                  alt="No Image Available"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              {recipe.isRecipeOfTheDay && (
                <span className="rounded-full absolute top-2 left-3 badge badge-success font-[poppins] text-white ">
                  Recipe of the Day
                </span>
              )}
            </div>
          </div>

          {/* Recipe Details */}
          <div className=" space-y-2 w-[50vw] justify-center flex flex-col">
            <h1 className="text-3xl font-bold font-[poppins] capitalize">
              {recipe.name}
            </h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-red-600 font-bold text-xl">
                ₦
                {Number(recipe.price).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {!isAdmin ? (
              <div className="space-y-4 pt-4">
                <a
                  className="btn bg-green-500 text-base-100 w-full rounded-none font-[inter] shadow-none border-0"
                  href={whatsappHref(recipe)}
                >
                  <img src={whatsapp} alt="WhatsApp" className="size-6" />
                  Order Ingredients
                </a>
                <button
                  className="btn btn-primary text-white w-full rounded-none border-none shadow-none font-[poppins]"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                  Add Ingredients to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-4">
                <button
                  className="btn rounded-none border-none text-white bg-primary mr-2 w-full"
                  onClick={() => handleEditRecipe(recipe._id)}
                >
                  <Pen /> Edit Recipe
                </button>
                <button
                  className="btn rounded-none border-none shadow-none w-full btn-error"
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  disabled={isDeletingRecipe}
                >
                  {isDeletingRecipe ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}{' '}
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full mt-4">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-300 justify-center">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 font-[inter] transition-colors duration-300 ${
                activeTab === 'ingredients'
                  ? 'border-b-2 border-primary font-bold text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2 font-[inter] transition-colors duration-300 ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary font-bold text-primary'
                  : 'text-gray-500 hover:text-primary'
              }`}
            >
              Description
            </button>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            {activeTab === 'ingredients' && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="prose text-gray-700">
                  <h3 className="font-medium">Ingredients</h3>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((item, index) => (
                        <li key={index} className="capitalize">
                          {item.name}
                        </li>
                      ))
                    ) : (
                      <li>No ingredients listed.</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            )}
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold">Description</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: recipe.description }}
                ></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
              <p className="mb-6">
                This action will permanently delete this recipe.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-error text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
