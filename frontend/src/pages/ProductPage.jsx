// src/pages/ProductPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // NEW: useRef for touch events
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  Loader,
  Pen,
  Trash2,
} from 'lucide-react';
import whatsapp from '../images/whatsapp.png';
import { useProductsStore } from '../store/useProductsStore';
// import whatsapp from '../images/whatsapp.png';
// import { useCartStore } from '../store/useCartStore';
// import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';
const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, getProductById, isGettingProducts } = useProductsStore();
  //   const { addToCart, isAddingToCart } = useCartStore();

  const { isAdmin } = useAuthStore();

  const { isDeletingProduct, delProduct } = useAdminStore();

  const handleEditProduct = (product) => {
    // console.log(product);
    navigate(`/admin/products/edit/${product}`);
  };

  const handleDeleteProduct = async (productId) => {
    // NEW: Add a confirmation prompt before deleting
    if (
      window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      delProduct(productId);
      navigate(-1);
      // User cancelled the deletion
      // toast.info('Product deletion cancelled.'); // Optional: inform user
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // NEW: Refs for touch events
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50; // Minimum distance for a recognized swipe

  // Fetch product details when component mounts or productId changes
  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId, getProductById]);

  // Reset currentImageIndex when product changes (e.g., navigating to a new product page)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // Handle image navigation
  const nextImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + product.images.length) % product.images.length
      );
    }
  };

  // NEW: Touch event handlers for image sliding
  const onTouchStart = (e) => {
    touchEndX.current = 0; // Reset end touch on new start
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return; // Ensure touch points exist

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }

    // Reset touch points
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Placeholder functions for cart and wishlist
  //   const handleAddToCart = (id, quantity, type) => {
  //     addToCart(id, quantity, type);
  //   };

  //   // console.log(wishlist);
  //   const handleAddToWishlist = (id, type) => {
  //     addToWishlist(id, type);
  //   };

  //   const handleRemovefromWishlist = (id, type) => {
  //     removeFromwishlist(id, type);
  //   };

  //   const isInWishlist = (wishlist || []).some(
  //     (wishlistItem) =>
  //       wishlistItem.item === productId && wishlistItem.itemType === 'Product'
  //   );

  const whatsappNumber = '2348066258729'; // Your actual WhatsApp number

  // Construct the base product URL dynamically using window.location.origin
  // This will correctly resolve to http://localhost:5173 or your actual deployed domain
  const productLink = (id) => `${window.location.origin}/product/${id}`;

  // Construct the full message, ensuring it's fully URL-encoded
  const fullMessage = (product) =>
    encodeURIComponent(
      `I want to Order this: ${product.name}.\n` + // Use \n for new lines in WhatsApp
        `Price: N${
          product?.discountedPrice?.toFixed(2) || product.price?.toFixed(2)
        }.\n` +
        `Link: ${productLink(product._id)}`
    );

  const whatsappHref = (product) =>
    `https://wa.me/${whatsappNumber}?text=${fullMessage(product)}`;

  // Loading state
  if (isGettingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading product details...</p>
      </div>
    );
  }

  // Error state (e.g., product not found, network error)
  // if (productsError) {
  //     return (
  //         <div role="alert" className="alert alert-error my-8 mx-auto w-full max-w-lg">
  //             <span>Error: {productsError}</span>
  //             <button onClick={() => navigate('/shop')} className="btn btn-sm btn-primary ml-4">Back to Shop</button>
  //         </div>
  //     );
  // }

  // If product is null (e.g., ID not found after loading)
  if (!product && !isGettingProducts) {
    return (
      <div className="text-center text-xl text-gray-600 mt-16">
        Product not found.
        <button
          onClick={() => navigate('/shop')}
          className="btn btn-sm btn-primary ml-4"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  console.log(product.images[0]);

  // Main Product Display
  return (
    <div className="items-center flex flex-col">
      <div className="w-full flex justify-between mb-2">
        <button
          onClick={() => {
            navigate(-1);
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 10);
          }}
          className="btn btn-circle mx-4 mt-2"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
          }}
          className="btn btn-circle mx-4 mt-2"
        >
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full">
        {/* Product Image Gallery */}
        <div className="sm:w-1/2 flex flex-col items-center">
          <div
            className="relative w-full aspect-video sm:aspect-[4/3] h-70 max-h-[500px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
            onTouchStart={onTouchStart} // NEW: Touch event for main image
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.name}
                  className="object-contain w-full h-full rounded-xl transition-opacity duration-300 ease-in-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/600x400/E0E0E0/333333?text=Image+Error';
                  }}
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    {product.isBestSeller && (
                      <button className="absolute font-[poppins] top-2 left-3 btn rounded-full border-0 shadow-none mt-1 bg-green-500">
                        Best Seller
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <img
                src="https://placehold.co/600x400/E0E0E0/333333?text=No+Image"
                alt="No Image Available"
                className="w-full h-full object-contain rounded-lg"
              />
            )}
          </div>

          {/* NEW: Image Previews (Thumbnails) */}
          {product.images && product.images.length > 0 && (
            <div className="hidden mt-4 md:flex flex-wrap justify-center gap-2">
              {product.images.map((image, index) => (
                <img
                  key={image.public_id || index} // Use public_id if available, otherwise index
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-200
                                        ${
                                          index === currentImageIndex
                                            ? 'border-primary shadow-md'
                                            : 'border-transparent hover:border-gray-300'
                                        }`}
                  onClick={() => setCurrentImageIndex(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/80x80/E0E0E0/333333?text=Err';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="sm:w-1/2 space-y-1">
          <div className="flex flex-wrap space-x-2 font-normal text-gray-500 items-center text-xs sm:text-base">
            {/* <p>{product.style}</p> */}
            <p className="capitalize">{product.category}</p>
            {/* {product.isForeign && product.origin && (
              <span>| Made in {product.origin}</span>
            )} */}
            {/* {product.collectionId && product.collectionId.name && (
              <p>| {product.collectionId.name} collection</p>
            )} */}
          </div>
          <h1 className="text-3xl font-bold font-[poppins]">{product.name}</h1>
          {/* <div className="text-base font-[montserrat] text-gray-600"></div> */}
          <div className="flex items-baseline space-x-3">
            {product.isPromo && product.discountedPrice !== undefined ? (
              <>
                <span className="text-red-600 font-bold text-xl">
                  ₦
                  {Number(product.discountedPrice).toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-gray-500 line-through text">
                  ₦
                  {Number(product.price).toLocaleString('en-NG', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-green-600 text font-semibold">
                  (
                  {(
                    ((product.price - product.discountedPrice) /
                      product.price) *
                    100
                  ).toFixed(0)}
                  % OFF)
                </span>
              </>
            ) : (
              <span className="text-red-600 font-bold text-xl">
                ₦
                {Number(product.price).toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>{' '}
          <p>
            <b>Ingredients:</b> {product.ingredients}
          </p>
          {!isAdmin ? (
            <a
              className="my-4 btn bg-green-500 text-base-100 w-full rounded-none font-[inter] shadow-none border-0"
              href={whatsappHref(product)}
            >
              <img src={whatsapp} alt="" className="size-6" />
              Order Now
            </a>
          ) : null}
          {isAdmin ? (
            <div className="space-y-2">
              <button
                className="btn rounded-none border-none text-white bg-primary mr-2 w-full"
                onClick={() => handleEditProduct(productId)}
              >
                <Pen /> Edit Product
              </button>
              <button
                className="btn rounded-none border-none shadow-none w-full btn-error"
                onClick={() => handleDeleteProduct(product._id)}
              >
                {isDeletingProduct ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}{' '}
                Delete Product
              </button>
            </div>
          ) : null}
          {!isAdmin ? (
            <div className="flex space-x-4 mb-6">
              <button
                className="btn btn-primary text-white flex-1 rounded-none border-none shadow-none font-[poppins] shadow-none border-0"
                // onClick={() => handleAddToCart(product._id, 1, 'Product')}
              >
                {/* {isAddingToCart ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShoppingCart size={20} />
                )} */}
                Add to Cart
              </button>
            </div>
          ) : null}
          <p className='font-bold'>
            Description
          </p>
          <p
            className="text text-gray-700 font-[montserrat]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
