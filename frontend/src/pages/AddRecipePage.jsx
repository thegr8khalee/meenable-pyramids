// src/pages/AdminAddRecipePage.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import { Loader2, XCircle } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useProductsStore } from '../store/useProductsStore';

const AdminAddRecipePage = () => {
  // Assuming useAdminStore has getProducts, addRecipe, products, isAddingRecipe, and isGettingProducts
  const {
    // products,
    // isGettingProducts,
    // getProducts,
    addRecipe,
    isAddingRecipe,
  } = useAdminStore();

  const { getProducts, products, isGettingProducts } = useProductsStore();
  const navigate = useNavigate();

  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    rodd: false,
  });

  // State for the ingredient selector
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [error, setError] = useState(null);

  // Fetch all products when the component mounts
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Handle changes for text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        image: reader.result,
      }));
      setImagePreview(reader.result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
      toast.error('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: '',
    }));
    setImagePreview(null);
  };

  // Handle adding an ingredient from the dropdown
  const handleAddIngredient = (product) => {
    if (!selectedIngredients.some((item) => item._id === product._id)) {
      setSelectedIngredients((prev) => [...prev, product]);
    }
    setSearchQuery('');
    setError(null);
  };

  // Handle removing an ingredient from the selected list
  const handleRemoveIngredient = (idToRemove) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item._id !== idToRemove)
    );
    setError(null);
  };

  // Filter the products based on the search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const htmlDescription = editorRef.current
      ? editorRef.current.getContent()
      : '';
    const strippedDescription = htmlDescription.replace(/<[^>]*>/g, '').trim();

    if (!strippedDescription) {
      setError('Description cannot be empty.');
      return;
    }

    if (selectedIngredients.length === 0) {
      setError('At least one ingredient is required.');
      return;
    }

    if (!formData.image) {
      setError('An image is required for the recipe.');
      return;
    }

    const ingredientIds = selectedIngredients.map((item) => item._id);

    const recipeData = {
      name: formData.name,
      description: htmlDescription,
      ingredients: ingredientIds,
      image: formData.image,
      rodd: formData.rodd
    };

    await addRecipe(recipeData);

    navigate('/admin/dashboard?section=recipes');
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-base-200">
      <div className="p-4 py-12 bg-base-100 rounded-none shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-primary font-[inter]">
          Add New Recipe
        </h2>

        {error && (
          <div role="alert" className="alert alert-error mb-4 rounded-md">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Cardamom blend"
              className="input input-bordered w-full rounded-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <div className="border border-base-300 rounded-md overflow-hidden">
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                apiKey="esh5bav8bmcm4mdbribpsniybxdqty6jszu5ctwihsw35a5y"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Recipe Image</span>
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-bordered w-full rounded-none"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-4 relative group">
                <img
                  src={imagePreview}
                  alt="Recipe Preview"
                  className="w-full h-48 object-cover rounded-md shadow-sm border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Remove image"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ingredients</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a product..."
                className="input input-bordered w-full rounded-none pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              <div className="flex flex-wrap gap-2 p-2 min-h-[44px] bg-base-200 rounded-none border border-t-0 border-base-300">
                {selectedIngredients.map((ingredient) => (
                  <div
                    key={ingredient._id}
                    className="badge badge-primary gap-2"
                  >
                    <span>{ingredient.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient._id)}
                      className="ml-1"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {showDropdown && (
                <ul className="absolute z-10 w-full bg-base-100 border border-base-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isGettingProducts ? (
                    <li className="p-4 text-center text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    </li>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <li
                        key={product._id}
                        className="p-4 cursor-pointer hover:bg-base-200"
                        onMouseDown={() => handleAddIngredient(product)}
                      >
                        {product.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">
                      No products found.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Recipe of the day</span>
              <input
                type="checkbox"
                name="rodd"
                className="checkbox checkbox-primary"
                checked={formData.rodd}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full text-lg text-white font-semibold py-3 rounded-none shadow-md hover:shadow-lg transition duration-200 font-[inter]"
              disabled={isAddingRecipe}
            >
              {isAddingRecipe ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Add Recipe'
              )}
            </button>
          </div>

          <div className="form-control mt-4">
            <button
              type="button"
              className="btn btn-ghost w-full text-lg font-semibold py-3 rounded-none"
              onClick={() => navigate('/admin/dashboard?section=recipes')}
              disabled={isAddingRecipe}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddRecipePage;
