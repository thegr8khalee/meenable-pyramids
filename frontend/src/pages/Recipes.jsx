/* eslint-disable no-unused-vars */
// src/pages/Recipes.jsx
import spiceherbs from '../images/spices-herbs.webp';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/useProductsStore';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Filter, Search, ShoppingCart } from 'lucide-react';
import FilterModal from '../components/FilterModal';
import whatsapp from '../images/whatsapp.webp';
import { useCartStore } from '../store/UseCartStore';
import { useAdminStore } from '../store/useAdminStore';

const ITEMS_PER_PAGE = 12;

const Recipes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isAdmin, checkAuth, isAuthReady } = useAuthStore();
  const { addRecipeToCart } = useCartStore();

  const { recipes, getRecipes, isGettingRecipes, hasMoreRecipes } =
    useAdminStore();

  // Search States
  const productSearchInputRef = useRef(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Pagination
  const [localPageProduct, setLocalPageProduct] = useState(1);

  // Initial Auth Check and Data Fetch
  useEffect(() => {
    checkAuth();
    // Pass the search query string directly, not an object
    getRecipes(1, ITEMS_PER_PAGE, false, productSearchQuery);
  }, [checkAuth, getRecipes, productSearchQuery]); // Add productSearchQuery as a dependency

  // This effect will trigger a new search whenever the productSearchQuery state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset page to 1 and fetch new data
      setLocalPageProduct(1);
      getRecipes(1, ITEMS_PER_PAGE, false, productSearchQuery);
    }, 500); // 500ms debounce

    // Cleanup function to clear the timer on re-render
    return () => clearTimeout(timer);
  }, [productSearchQuery, getRecipes]);

  console.log(recipes);
  // URL Param Handling
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const viewFromUrl = queryParams.get('view');

  //   if (viewFromUrl === 'herbs') {
  //     setViewMode('herbs');
  //   } else if (viewFromUrl === 'seasoning') {
  //     setViewMode('seasoning');
  //   } else if (viewFromUrl === 'chilli powder') {
  //     setViewMode('chilli powder');
  //   } else {
  //     setViewMode('spice');
  //   }
  // }, [location.search]);

  // Search Bar Focus
  useEffect(() => {
    if (location.state?.focusSearch && productSearchInputRef.current) {
      productSearchInputRef.current.focus();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.focusSearch, navigate, location.pathname]);

  // Load more products
  const handleLoadMoreRecipes = () => {
    if (!isGettingRecipes && hasMoreRecipes) {
      const nextPage = localPageProduct + 1;
      // Pass the search query string directly
      getRecipes(nextPage, ITEMS_PER_PAGE, true, productSearchQuery);
      setLocalPageProduct(nextPage);
    }
  };

  // Product click handler
  const handleProductClick = (Id) => {
    navigate(`/recipe/${Id}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  const handleAddRecipeToCart = (id) => {
    addRecipeToCart(id);
  };

  // WhatsApp link helper
  const whatsappPhoneNumber = '2348066258729';
  const whatsappHref = (item) => {
    const itemName = item.name || 'item';
    const itemPrice =
      item.isPromo && item.discountedPrice !== undefined
        ? Number(item.discountedPrice).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : Number(item.price).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
    const message = encodeURIComponent(
      `Hello, I'm interested in "${itemName}" (Price: ₦${itemPrice}). I saw it on your website and would like to inquire more.`
    );
    return `https://wa.me/${whatsappPhoneNumber}?text=${message}`;
  };

  return (
    <div className="">
      <div className="relative">
        <img
          src={spiceherbs}
          alt="Shop Hero"
          className="object-cover h-50 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="absolute bottom-15 left-1/2 -translate-x-1/2 mt-20 mb-2 text-5xl font-bold text-center text-base-100 font-[poppins]">
            Recipes
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <>
          <div className="sm:flex w-full my-5 items-center">
            {/* Search Bar */}
            <div className="form-control w-full">
              <div className="relative">
                <Search className="size-5 z-10 absolute left-3 top-1/2 stroke-gray-400 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  className="input input-bordered w-full pl-10 pr-3 rounded-none"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  ref={productSearchInputRef}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isGettingRecipes && recipes.length === 0 ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="ml-2 text-lg">Loading products...</p>
            </div>
          ) : recipes.length === 0 && !isGettingRecipes ? (
            <div className="text-center text-xl text-gray-600 my-16">
              No recipes found for the selected filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((product) => (
                <div
                  key={product._id}
                  className="rounded-none shadow-lg overflow-hidden"
                >
                  <figure className="relative h-85 w-full overflow-hidden rounded-none">
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={
                          product.image
                            ? product.image.url
                            : 'https://placehold.co/400x300/E0E0E0/333333?text=No+Image'
                        }
                        alt={product.name}
                        className="w-full h-full rounded-none object-cover transform transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://placehold.co/400x300/E0E0E0/333333?text=Image+Error';
                        }}
                      />
                    </button>
                  </figure>

                  <div className="p-2">
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div>
                          <h2 className="text-lg truncate whitespace-nowrap capitalize">
                            {product.name}
                          </h2>
                          <h2
                            className=" capitalize line-clamp-1"
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                          ></h2>
                        </div>
                        <div className="flex justify-between w-full items-center">
                          <div></div>
                          <div>
                            {!isAdmin ? (
                              <div className="space-x-1">
                                <a
                                  href={whatsappHref(product)}
                                  className="btn rounded-none bg-green-400 shadow-none border-none"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={whatsapp}
                                    alt="WhatsApp"
                                    className="size-5"
                                  />
                                </a>
                                <button
                                  type="button"
                                  className="btn text-white rounded-none bg-primary shadow-none border-none"
                                  onClick={() => handleAddRecipeToCart(product)}
                                >
                                  <ShoppingCart className="" />
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMoreRecipes && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleLoadMoreRecipes}
                className="mb-4 btn text-white bg-primary px-8 py-3 rounded-none font-semibold"
              >
                {!isGettingRecipes ? (
                  'Load More'
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </button>
            </div>
          )}

          {!hasMoreRecipes && recipes.length > 0 && !isGettingRecipes && (
            <p className="text-center text-gray-600 my-8">
              You've reached the end of the recipes!
            </p>
          )}
        </>
      </div>
    </div>
  );
};

export default Recipes;
