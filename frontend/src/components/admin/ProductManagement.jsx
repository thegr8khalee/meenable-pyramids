// src/components/Admin/ProductManagement.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../../store/useProductsStore';
import { Loader2, Pen, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

// Note: For a production app, replace window.confirm with a custom modal for better UX.

const ProductManagement = () => {
  // Destructure `hasMoreProducts` and `currentPage` from the store
  const {
    products,
    getProducts,
    isGettingProducts,
    hasMoreProducts,
    currentPage,
  } = useProductsStore();
  const { isDeletingProduct, delProduct } = useAdminStore();

  useEffect(() => {
    // Initial fetch of products on component mount.
    // getProducts is a dependency, so we don't need to pass a page number.
    // The store's logic will handle fetching the first page.
    getProducts();
  }, [getProducts]);

  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    // IMPORTANT: In a production app, use a custom modal instead of window.confirm.
    if (
      window.confirm(
        'Are you sure you want to delete this product? All recipes including this product as an ingredient will be deleted as well. This action cannot be undone.'
      )
    ) {
      const success = await delProduct(productId);
      if (success) {
        window.location.reload();
      } else {
        // toast.error('Failed to delete product.');
      }
    }
  };

  const handleLoadMore = () => {
    // Call getProducts with the next page number to fetch more
    getProducts(currentPage + 1);
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-secondary font-[inter]">
        Manage Products
      </h2>
      <button
        className="w-full btn btn-primary text-white mb-6 border-0 shadow-0 rounded-none"
        onClick={handleAddProduct}
      >
        Add New Product
      </button>

      <div className="overflow-x-auto w-full">
        {/* Loading indicator for the initial fetch */}
        {isGettingProducts && currentPage === 0 && (
          <div className="flex justify-center items-center p-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-primary">Loading data...</span>
          </div>
        )}

        {/* Hide table on initial load to prevent empty table flash */}
        {!isGettingProducts || currentPage > 0 ? (
          <table className="table w-full text-left">
            <thead>
              <tr className="border-b-2 border-base-content">
                <th className="px-4 py-2 w-1/4">Name</th>
                <th className="px-4 py-2 w-1/4">Category</th>
                <th className="px-4 py-2 w-1/4">Price</th>
                <th className="px-4 py-2 w-1/4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-base-content">
                  <td className="px-4 py-2 font-medium">{product.name}</td>
                  <td className="px-4 py-2 text-base-content/70">
                    {product.category}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {product.isPromo &&
                    product.discountedPrice !== undefined ? (
                      <>
                        <span className="text-red-600 mr-1">
                          ₦
                          {Number(product.discountedPrice).toLocaleString(
                            'en-NG',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                        <span className="text-gray-500 line-through text">
                          ₦
                          {Number(product.price).toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </>
                    ) : (
                      <span className="">
                        ₦
                        {Number(product.price).toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="btn btn-circle btn-primary text-white"
                        onClick={() => handleEditProduct(product._id)}
                      >
                        <Pen size={18} />
                      </button>
                      <button
                        className="btn btn-circle btn-error"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={isDeletingProduct}
                      >
                        {isDeletingProduct ? (
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
      {hasMoreProducts && (
        <div className="mt-6 flex justify-center">
          <button
            className="btn btn-outline btn-primary rounded-none shadow-none w-full"
            onClick={handleLoadMore}
            disabled={isGettingProducts}
          >
            {isGettingProducts ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Load More Products'
            )}
          </button>
        </div>
      )}

      {/* Show message if there are no products */}
      {!isGettingProducts && products.length === 0 && (
        <div className="text-center p-8 text-lg text-gray-500">
          No products found. Add a new product to get started!
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
