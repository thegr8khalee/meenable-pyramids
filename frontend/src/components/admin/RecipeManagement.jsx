// src/components/Admin/RecipeManagement.jsx
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Pen, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
// NOTE: Use a toast notification library like react-hot-toast for better UX
// instead of window.confirm in a production app.

const RecipeManagement = () => {
  // Destructure pagination states from the store
  const {
    recipes,
    getRecipes,
    isDeletingRecipes,
    isGettingRecipes,
    deleteRecipe,
    toggleRecipeOfTheDay,
    isTogglingRecipeOfTheDay,
    hasMoreRecipes,
    currentPage,
  } = useAdminStore();

  useEffect(() => {
    // Initial fetch of recipes on component mount.
    // The store's logic will handle fetching the first page.
    getRecipes();
  }, [getRecipes]);

  const navigate = useNavigate();

  // Use useMemo to sort the recipes. The sorting will only re-run when
  // the 'recipes' array changes, improving performance.
  const sortedRecipes = useMemo(() => {
    const sorted = [...recipes].sort((a, b) => {
      // Prioritize the recipe of the day
      if (a.isRecipeOfTheDay && !b.isRecipeOfTheDay) return -1;
      if (!a.isRecipeOfTheDay && b.isRecipeOfTheDay) return 1;
      return 0;
    });
    return sorted;
  }, [recipes]);

  const handleAddProduct = () => {
    navigate('/admin/recipe/new');
  };

  const handleEditProduct = (recipeId) => {
    navigate(`/admin/recipe/edit/${recipeId}`);
  };

  const handleDeleteProduct = async (recipeId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this recipe? This action cannot be undone.'
      )
    ) {
      const success = await deleteRecipe(recipeId);
      if (success) {
        // toast.success('Product deleted successfully!');
      } else {
        // toast.error('Failed to delete product.');
      }
    }
  };

  const handleToggleRecipeOfTheDay = async (recipeId, currentStatus) => {
    await toggleRecipeOfTheDay(recipeId, !currentStatus);
  };

  const handleLoadMore = () => {
    // Call getRecipes with the next page number to fetch more
    getRecipes(currentPage + 1);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-secondary font-[inter]">
        Manage Recipes
      </h2>
      <button
        className="w-full btn btn-primary text-white mb-6 border-0 shadow-0 rounded-none"
        onClick={handleAddProduct}
      >
        Add New Recipe
      </button>

      <div className="overflow-x-auto w-full">
        {/* Loading indicator for the initial fetch */}
        {isGettingRecipes && currentPage === 0 && (
          <div className="flex justify-center items-center p-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-primary">Loading data...</span>
          </div>
        )}

        {/* Hide table on initial load to prevent empty table flash */}
        {!isGettingRecipes || currentPage > 0 ? (
          <table className="table w-full table-fixed text-left">
            <thead>
              <tr className="border-b-2 border-base-content">
                <th className="px-4 py-2 w-1/3">Name</th>
                <th className="px-4 py-2 w-1/3">Recipe of the Day</th>
                <th className="px-4 py-2 w-1/3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecipes.map((recipe) => (
                <tr key={recipe._id} className="border-b border-base-content">
                  <td className="px-4 py-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {recipe.name}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`font-[inter] btn btn-sm rounded-none shadow-none w-full ${
                        recipe.isRecipeOfTheDay
                          ? 'btn-primary text-white'
                          : 'btn-outline btn-primary'
                      }`}
                      onClick={() =>
                        handleToggleRecipeOfTheDay(
                          recipe._id,
                          recipe.isRecipeOfTheDay
                        )
                      }
                      disabled={isTogglingRecipeOfTheDay}
                    >
                      {isTogglingRecipeOfTheDay ? (
                        <Loader2 className="animate-spin" />
                      ) : recipe.isRecipeOfTheDay ? (
                        'Remove as ROD'
                      ) : (
                        'Set as ROD'
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-circle btn-primary text-white"
                        onClick={() => handleEditProduct(recipe._id)}
                      >
                        <Pen size={18} />
                      </button>
                      <button
                        className="btn btn-circle btn-error"
                        onClick={() => handleDeleteProduct(recipe._id)}
                        disabled={isDeletingRecipes}
                      >
                        {isDeletingRecipes ? (
                          <Loader2
                            className="animate-spin text-white"
                            size={18}
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* "Load More" button for pagination */}
      {hasMoreRecipes && (
        <div className="mt-6 flex justify-center">
          <button
            className="btn btn-outline btn-primary rounded-none shadow-none w-full"
            onClick={handleLoadMore}
            disabled={isGettingRecipes}
          >
            {isGettingRecipes && currentPage > 0 ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Load More Recipes'
            )}
          </button>
        </div>
      )}

      {/* Show message if there are no recipes */}
      {!isGettingRecipes && recipes.length === 0 && (
        <div className="text-center p-8 text-lg text-gray-500">
          No recipes found. Add a new recipe to get started!
        </div>
      )}
    </div>
  );
};

export default RecipeManagement;
