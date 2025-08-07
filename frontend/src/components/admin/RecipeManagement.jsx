// src/components/Admin/RecipeManagement.jsx
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Pen, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
// NOTE: Use a toast notification library like react-hot-toast for better UX
// instead of window.confirm in a production app.

const RecipeManagement = () => {
  const {
    recipes,
    getRecipes,
    isDeletingRecipes,
    isGettingRecipes,
    deleteRecipe,
    toggleRecipeOfTheDay, // Assuming this new action exists in your store
    isTogglingRecipeOfTheDay, // Assuming a loading state for the new action
  } = useAdminStore();

  useEffect(() => {
    getRecipes();
  }, [getRecipes]);

  const navigate = useNavigate();

  // Use useMemo to sort the recipes. The sorting will only re-run when
  // the 'recipes' array changes, improving performance.
  const sortedRecipes = useMemo(() => {
    // Return a new sorted array to avoid mutating the original store state
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
    // IMPORTANT: In a production app, use a custom modal instead of
    // window.confirm, as it can be a bad user experience.
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      const success = await deleteRecipe(recipeId);
      if (success) {
        // toast.success('Product deleted successfully!');
      } else {
        // toast.error('Failed to delete product.');
      }
    }
  };

  const handleToggleRecipeOfTheDay = async (recipeId, currentStatus) => {
    // Assuming a store action that makes an API call to update the status
    await toggleRecipeOfTheDay(recipeId, !currentStatus);
  };

  if (isGettingRecipes) {
    return (
      <div className="text-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <span className="mt-2">Loading Data...</span>
      </div>
    );
  }

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
        <table className="table w-full table-fixed text-left">
          <thead>
            <tr>
              <th className="px-4 py-2 w-1/3">Name</th>
              <th className="px-4 py-2 w-1/3">Recipe of the Day</th>
              <th className="px-4 py-2 w-1/3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRecipes.map((recipe) => (
              <tr key={recipe._id} className="border-b">
                <td className="px-4 py-2 text-ellipsis overflow-hidden whitespace-nowrap">{recipe.name}</td>
                <td className="px-4 py-2">
                  <button
                    className={`font-[inter] btn btn-sm rounded-none shadow-none w-full ${
                      recipe.isRecipeOfTheDay ? 'btn-primary text-white' : 'btn-outline btn-primary'
                    }`}
                    onClick={() => handleToggleRecipeOfTheDay(recipe._id, recipe.isRecipeOfTheDay)}
                    disabled={isTogglingRecipeOfTheDay} // Disable while the request is in progress
                  >
                    {isTogglingRecipeOfTheDay ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      recipe.isRecipeOfTheDay ? 'Remove as ROD' : 'Set as ROD'
                    )}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="btn btn-circle btn-primary text-white"
                      onClick={() => handleEditProduct(recipe._id)}
                    >
                      <Pen />
                    </button>
                    <button
                      className="btn btn-circle btn-error"
                      onClick={() => handleDeleteProduct(recipe._id)}
                      disabled={isDeletingRecipes}
                    >
                      {isDeletingRecipes ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeManagement;
