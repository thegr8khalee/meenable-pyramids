import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';
import { useProductsStore } from './useProductsStore.js';

export const useAdminStore = create((set, get) => ({
  authUser: null,
  isLoading: false,
  isSidebarOpen: false, // Initial state: sidebar is closed
  isAddingProduct: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
  users: [],
  usersCount: null,
  isGettingUsers: false,
  recipes: [],
  recipe: null,
  isGettingRecipes: false,
  isAddingRecipe: false,
  isUpdatingRecipe: false,
  isDeletingRecipe: false,
  recipeError: null,
  isTogglingRecipeOfTheDay: false,

  hasMoreUsers: true,
  hasMoreRecipes: true,
  currentPage: 0,
  currentPageUsers: 0,

  // Action to toggle sidebar visibility
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Action to explicitly close the sidebar
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Action to explicitly open the sidebar
  openSidebar: () => set({ isSidebarOpen: true }),

  adminLogin: async (data) => {
    set({ isLoading: true });
    try {
      console.log('Sending login request with data:', data); // Add this
      const res = await axiosInstance.post('/admin/login', data);
      console.log('Login response:', res);
      useAuthStore.setState({
        authUser: res.data,
        isAdmin: res.data?.role === 'admin',
      });
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error); // Add this
      console.error('Error response:', error.response); // Add this
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  AdminLogout: async () => {
    try {
      await axiosInstance.post('/admin/logout');
      useAuthStore.setState({ authUser: null });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message);
    }
  },

  addProduct: async (data) => {
    try {
      set({ isAddingProduct: true });
      const res = await axiosInstance.post(
        '/admin/operations/addProduct',
        data
      );
      useProductsStore.setState((state) => ({
        products: [...state.products, res.data],
      }));
      toast.success('success');
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      set({ isAddingProduct: false });
    }
  },

  updateProduct: async (productId, data) => {
    try {
      set({ isUpdatingProduct: true });
      const res = await axiosInstance.put(
        `admin/operations/updateProduct/${productId}`,
        data
      );
      useProductsStore.setState((state) => ({
        products: state.products.map((p) =>
          p._id === productId ? res.data : p
        ),
        product: res.data,
      }));
      toast.success('success');
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUpdatingProduct: false });
    }
  },

  delProduct: async (Id) => {
    try {
      set({ isDeletingProduct: true });
      await axiosInstance.delete(`admin/operations/delProduct/${Id}`);
      useProductsStore.setState((state) => ({
        products: state.products.filter((p) => p._id !== Id),
      }));
      toast.success('success');
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isDeletingProduct: false });
    }
  },

  getAllUsers: async (page = 1, limit = 50, append = true) => {
    // 1. Prevent redundant fetches: if already loading, or no more users
    if (get().isGettingUsers || !get().hasMoreUsers) {
      return;
    }

    set({ isGettingUsers: true, usersError: null });

    // 2. Security check: Only proceed if the user is an admin
    const { isAdmin } = useAuthStore.getState();
    if (!isAdmin) {
      // toast.error('You do not have permission to view users.');
      set({ isGettingUsers: false });
      return;
    }

    try {
      // 3. Make the API call with pagination query parameters
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
      }).toString();
      const res = await axiosInstance.get(
        `/admin/operations/getUsers?${queryParams}`
      );
      const { users: newUsers, hasMore, totalUsers } = res.data;

      // 4. Update the store state with the fetched users
      set((state) => ({
        users: append ? [...state.users, ...newUsers] : newUsers,
        currentPageUsers: page,
        hasMoreUsers: hasMore,
        usersCount: totalUsers,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch users.';
      set({ usersError: errorMessage, hasMoreUsers: false }); // Stop further loading on error
      // toast.error(errorMessage);
    } finally {
      // 5. Reset the loading state
      set({ isGettingUsers: false });
    }
  },

  getRecipes: async (page = 1, limit = 12, append = true, search = '') => {
    const { isGettingRecipes, hasMoreRecipes } = get();

    // Prevent redundant fetches
    if (isGettingRecipes || (!hasMoreRecipes && append)) {
      return;
    }

    set({ isGettingRecipes: true, recipeError: null });

    try {
      // Construct query parameters
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
      });
      // Add the search term to the query if it's not an empty string
      if (search) {
        queryParams.append('search', search);
      }

      const res = await axiosInstance.get(
        `/products/recipe/get?${queryParams.toString()}`
      );
      const { recipes: newRecipes, hasMore } = res.data;

      set((state) => ({
        recipes: append ? [...state.recipes, ...newRecipes] : newRecipes,
        currentPage: page,
        hasMoreRecipes: hasMore,
      }));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch recipes.';
      set({ recipeError: errorMessage, hasMoreRecipes: false });
    } finally {
      set({ isGettingRecipes: false });
    }
  },

  getRecipeById: async (id) => {
    set({ isGettingSingleRecipe: true, recipeError: null });
    try {
      const res = await axiosInstance.get(`/products/recipe/get/${id}`);
      // Return the single recipe data directly
      set({ recipe: res.data });
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch recipe.';
      set({ recipeError: errorMessage });
      toast.error(errorMessage);
      return null;
    } finally {
      set({ isGettingSingleRecipe: false });
    }
  },

  addRecipe: async (recipeData) => {
    set({ isAddingRecipe: true, recipeError: null });
    try {
      const res = await axiosInstance.post(
        '/admin/operations/recipe/new',
        recipeData
      );
      set((state) => ({ recipes: [...state.recipes, res.data] }));
      toast.success('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to add recipe.';
      set({ recipeError: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isAddingRecipe: false });
    }
  },

  editRecipe: async (recipeData) => {
    set({ isUpdatingRecipe: true, recipeError: null });
    try {
      const res = await axiosInstance.post(
        '/admin/operations/recipe/edit',
        recipeData
      );
      set((state) => ({
        recipes: state.recipes.map((recipe) =>
          recipe._id === res.data._id ? res.data : recipe
        ),
      }));
      toast.success('Recipe updated successfully!');
    } catch (error) {
      console.error('Error editing recipe:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to edit recipe.';
      set({ recipeError: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingRecipe: false });
    }
  },

  deleteRecipe: async (_id) => {
    set({ isDeletingRecipe: true, recipeError: null });
    try {
      await axiosInstance.delete('/admin/operations/recipe/remove', {
        data: { _id },
      });
      set((state) => ({
        recipes: state.recipes.filter((recipe) => recipe._id !== _id),
      }));
      toast.success('Recipe deleted successfully!');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to delete recipe.';
      set({ recipeError: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isDeletingRecipe: false });
    }
  },

  toggleRecipeOfTheDay: async (recipeId, status) => {
    set({ isTogglingRecipeOfTheDay: true, adminError: null });
    try {
      // API call to update the recipe
      const response = await axiosInstance.put(
        `/admin/operations/recipe/rodd/${recipeId}`,
        {
          isRecipeOfTheDay: status,
        }
      );

      const updatedRecipe = response.data.recipe;

      // Update the recipes in the store
      const allRecipes = get().recipes;
      const updatedRecipes = allRecipes.map((r) => {
        // If the current recipe is the one we updated, replace it with the new data
        if (r._id === updatedRecipe._id) {
          return updatedRecipe;
        }
        // If another recipe was previously the ROD, set its status to false
        if (r.isRecipeOfTheDay && r._id !== updatedRecipe._id) {
          return { ...r, isRecipeOfTheDay: false };
        }
        return r;
      });

      set({ recipes: updatedRecipes, isTogglingRecipeOfTheDay: false });
    } catch (error) {
      set({
        adminError:
          error.response?.data?.message ||
          'Failed to toggle Recipe of the Day.',
        isTogglingRecipeOfTheDay: false,
      });
      return false;
    }
    return true;
  },
}));
