/* eslint-disable no-unused-vars */
// src/pages/Shop.jsx
import spiceherbs from '../images/spices-herbs.jpg';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProductsStore } from '../store/useProductsStore';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Filter, Search, ShoppingCart } from 'lucide-react';
import FilterModal from '../components/FilterModal';
import whatsapp from '../images/whatsapp.png';
import { useCartStore } from '../store/UseCartStore';
const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand Store States and Actions
  const { products, getProducts, isGettingProducts, hasMoreProducts } =
    useProductsStore();
  const { isAdmin, checkAuth, isAuthReady } = useAuthStore();
  const {
    addToCart,
    // isAddingToCart,
  } = useCartStore();

  const handleAddToCart = (id, quantity, type) => {
    addToCart(id, quantity, type);
  };

  // View Mode State ('spice', 'herbs', or 'seasoning')
  const [viewMode, setViewMode] = useState('spice');

  // Filter States
  const productSearchInputRef = useRef(null);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [minPriceProduct, setMinPriceProduct] = useState('');
  const [maxPriceProduct, setMaxPriceProduct] = useState('');
  const [isBestSellerFilterProduct, setIsBestSellerFilterProduct] =
    useState(false);
  const [isPromoFilterProduct, setIsPromoFilterProduct] = useState(false);
  const [isForeignFilterProduct, setIsForeignFilterProduct] = useState(false);
  const [isPriceFilterAppliedProduct, setIsPriceFilterAppliedProduct] =
    useState(false);
  const [isProductFilterModalOpen, setIsProductFilterModalOpen] =
    useState(false);

  // Pagination
  const [localPageProduct, setLocalPageProduct] = useState(1);

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // URL Param Handling
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const viewFromUrl = queryParams.get('view');

    if (viewFromUrl === 'herbs') {
      setViewMode('herbs');
    } else if (viewFromUrl === 'seasoning') {
      setViewMode('seasoning');
    } else if (viewFromUrl === 'chilli powder') {
      setViewMode('chilli powder');
    } else {
      setViewMode('spice');
    }
  }, [location.search]);

  // Search Bar Focus
  useEffect(() => {
    if (location.state?.focusSearch && productSearchInputRef.current) {
      productSearchInputRef.current.focus();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.focusSearch, navigate, location.pathname]);

  // Build filters with category based on viewMode
  const buildProductFilters = useCallback(() => {
    const filters = {};

    // Set category based on viewMode
    if (viewMode === 'spice') {
      filters.category = 'spice';
    } else if (viewMode === 'herbs') {
      filters.category = 'herb'; // Map 'herbs' UI to 'herb' enum
    } else if (viewMode === 'seasoning') {
      filters.category = 'seasoning'; // Map 'seasoning' UI to 'blend' enum
    } else if (viewMode == 'chilli powder') {
      filters.category = 'chilli powder';
    }

    if (productSearchQuery.trim() !== '') {
      filters.search = productSearchQuery.trim();
    }
    if (minPriceProduct !== '' && !isNaN(parseFloat(minPriceProduct))) {
      filters.minPrice = parseFloat(minPriceProduct);
    }
    if (maxPriceProduct !== '' && !isNaN(parseFloat(maxPriceProduct))) {
      filters.maxPrice = parseFloat(maxPriceProduct);
    }
    if (isBestSellerFilterProduct) {
      filters.isBestSeller = true;
    }
    if (isPromoFilterProduct) {
      filters.isPromo = true;
    }
    return filters;
  }, [
    viewMode,
    productSearchQuery,
    minPriceProduct,
    maxPriceProduct,
    isBestSellerFilterProduct,
    isPromoFilterProduct,
  ]);

  // Fetch products when filters or viewMode changes
  useEffect(() => {
    if (isAuthReady) {
      setLocalPageProduct(1);
      const filters = buildProductFilters();
      getProducts(1, ITEMS_PER_PAGE, filters, false);
    }
  }, [isAuthReady, buildProductFilters, getProducts, viewMode]);

  // Load more products
  const handleLoadMoreProducts = () => {
    if (!isGettingProducts && hasMoreProducts) {
      const nextPage = localPageProduct + 1;
      const filters = buildProductFilters();
      getProducts(nextPage, ITEMS_PER_PAGE, filters, true);
      setLocalPageProduct(nextPage);
    }
  };

  // Filter modal handlers
  const handleOpenProductFilterModal = () => setIsProductFilterModalOpen(true);
  const handleCloseProductFilterModal = () =>
    setIsProductFilterModalOpen(false);
  const handleApplyProductFilters = () => setIsProductFilterModalOpen(false);
  const handleClearProductFilters = () => {
    setProductSearchQuery('');
    setMinPriceProduct('');
    setMaxPriceProduct('');
    setIsBestSellerFilterProduct(false);
    setIsPromoFilterProduct(false);
    setIsForeignFilterProduct(false);
    setIsPriceFilterAppliedProduct(false);
    setIsProductFilterModalOpen(false);
  };

  // Product click handler
  const handleProductClick = (Id) => {
    navigate(`/product/${Id}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
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
            Shop
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Product Category Switch */}
        <div className="flex justify-center my-5">
          <div className="tabs tabs-boxed space-x-4">
            <button
              type="button"
              className={`btn tab rounded-none shadow-none border-none ${
                viewMode === 'spice' ? 'tab-active bg-primary text-white' : ''
              }`}
              onClick={() => setViewMode('spice')}
            >
              Spice
            </button>
            <button
              type="button"
              className={`btn tab rounded-none shadow-none border-none ${
                viewMode === 'herbs' ? 'tab-active bg-primary text-white' : ''
              }`}
              onClick={() => setViewMode('herbs')}
            >
              Herb
            </button>
            <button
              type="button"
              className={`btn tab rounded-none shadow-none border-none ${
                viewMode === 'seasoning'
                  ? 'tab-active bg-primary text-white'
                  : ''
              }`}
              onClick={() => setViewMode('seasoning')}
            >
              Seasoning
            </button>
            <button
              type="button"
              className={`btn tab rounded-none shadow-none border-none ${
                viewMode === 'chilli powder'
                  ? 'tab-active bg-primary text-white'
                  : ''
              }`}
              onClick={() => setViewMode('chilli powder')}
            >
              Chiili Powder
            </button>
          </div>
        </div>

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

            {/* Filters Button */}
            <div className="form-control w-full sm:ml-2 sm:mt-0 mt-2 sm:w-auto">
              <button
                type="button"
                className="btn text-white btn-primary rounded-none w-full"
                onClick={handleOpenProductFilterModal}
              >
                <Filter size={20} /> Filters
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {isGettingProducts && products.length === 0 ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="ml-2 text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 && !isGettingProducts ? (
            <div className="text-center text-xl text-gray-600 my-16">
              No products found for the selected filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="rounded-none shadow-lg overflow-hidden"
                >
                  <figure className="relative h-70 w-full overflow-hidden rounded-none">
                    <button
                      type="button"
                      className="w-full h-full"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0].url
                            : 'https://placehold.co/400x300/E0E0E0/333333?text=No+Image'
                        }
                        alt={product.name}
                        className="w-full h-full rounded-none object-cover bg-black transform transition-transform duration-300 hover:scale-105"
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
                          <h2 className="text-lg truncate whitespace-nowrap">
                            {product.name}
                          </h2>
                          <h2 className="text-lg truncate whitespace-nowrap capitalize">
                            {product.category}
                          </h2>
                        </div>
                        <div className="flex justify-between w-full items-center">
                          <div>
                            {product.isPromo &&
                            product.discountedPrice !== undefined ? (
                              <div className="flex flex-col">
                                <span className="text-red-600 font-bold text-lg">
                                  ₦
                                  {Number(
                                    product.discountedPrice
                                  ).toLocaleString('en-NG', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                                <span className="text-gray-500 line-through text-sm">
                                  ₦
                                  {Number(product.price).toLocaleString(
                                    'en-NG',
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className="font-semibold text-lg">
                                ₦
                                {Number(product.price).toLocaleString('en-NG', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            )}
                          </div>
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
                                  onClick={() =>
                                    handleAddToCart(product._id, 1)
                                  }
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

          {hasMoreProducts && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleLoadMoreProducts}
                className="mb-4 btn text-white bg-primary px-8 py-3 rounded-full font-semibold"
              >
                {!isGettingProducts ? (
                  'Load More'
                ) : (
                  <Loader2 className="animate-spin" />
                )}
              </button>
            </div>
          )}

          {!hasMoreProducts && products.length > 0 && !isGettingProducts && (
            <p className="text-center text-gray-600 my-8">
              You've reached the end of the products!
            </p>
          )}

          {/* Filter Modal */}
          <FilterModal
            isOpen={isProductFilterModalOpen}
            onClose={handleCloseProductFilterModal}
            minPrice={minPriceProduct}
            setMinPrice={setMinPriceProduct}
            maxPrice={maxPriceProduct}
            setMaxPrice={setMaxPriceProduct}
            isBestSellerFilter={isBestSellerFilterProduct}
            setIsBestSellerFilter={setIsBestSellerFilterProduct}
            isPromoFilter={isPromoFilterProduct}
            setIsPromoFilter={setIsPromoFilterProduct}
            // isForeignFilter={isForeignFilterProduct}
            // setIsForeignFilter={setIsForeignFilterProduct}
            setIsPriceFilterApplied={setIsPriceFilterAppliedProduct}
            onApplyFilters={handleApplyProductFilters}
            onClearFilters={handleClearProductFilters}
          />
        </>
      </div>
    </div>
  );
};

export default Shop;
