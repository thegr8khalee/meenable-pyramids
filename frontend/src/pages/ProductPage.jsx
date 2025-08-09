// src/pages/ProductPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Share2,
  Pen,
  Trash2,
  Star,
} from 'lucide-react';
import whatsapp from '../images/whatsapp.png';
import { useProductsStore } from '../store/useProductsStore';
import { useCartStore } from '../store/UseCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';
import { useReviewStore } from '../store/useReviewStore';
import { formatTime } from '../lib/utils';

const ProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, getProductById, isGettingProducts } = useProductsStore();
  const { addToCart, isAddingToCart } = useCartStore();
  const { isAdmin, authUser } = useAuthStore();
  const { isDeletingProduct, delProduct } = useAdminStore();
  const {
    isAddingReview,
    addReview,
    editReview,
    isEditingReview,
    deleteReview,
    isDeletingReview,
  } = useReviewStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  // Fetch product data
  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId, getProductById]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const handleAddToCart = (id, quantity = 1) => {
    addToCart(id, quantity, 'Product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await delProduct(productId);
      navigate(-1);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Touch event handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // WhatsApp sharing
  const whatsappNumber = '2348066258729';
  const productLink = (id) => `${window.location.origin}/product/${id}`;

  const fullMessage = (product) =>
    encodeURIComponent(
      `I want to Order this: ${product.name}.\n` +
        `Price: N${
          product?.discountedPrice?.toFixed(2) || product.price?.toFixed(2)
        }.\n` +
        `Link: ${productLink(product._id)}`
    );

  const whatsappHref = (product) =>
    `https://wa.me/${whatsappNumber}?text=${fullMessage(product)}`;

  const [reviewRating, setReviewRating] = useState(0);
  //   const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    if (product && authUser) {
      const myReview = product.reviews?.find(
        (r) => r.userId?._id === authUser._id
      );
      if (myReview) {
        setReviewRating(myReview.rating || 0);
        setFormData({
          reviewRating: myReview.rating || 0,
          reviewComment: myReview.comment || '',
        });
      }
    }
  }, [product, authUser]);

  const myReview =
    product?.reviews?.find((review) => review.userId?._id === authUser?._id) ||
    null;

  console.log('my review: ', myReview);

  const [formData, setFormData] = useState({
    reviewRating: 0,
    reviewComment: '',
  });

  //   const [formDataEdit, setFormDataEdit] = useState({
  //     reviewRating: 0,
  //     reviewComment: '',
  //   });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddReview = async () => {
    await addReview(productId, formData);
    await getProductById(productId);
  };

  const handleEditReview = async () => {
    await editReview(productId, myReview._id, formData);
    await getProductById(productId);
  };

  const handleDeleteReview = async () => {
    await deleteReview(productId, myReview._id);
    await getProductById(productId);
  };
  console.log(product);

  // Loading state
  if (isGettingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading product details...</p>
      </div>
    );
  }

  // Product not found state
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

  return (
    <div className="items-center flex flex-col">
      {/* Navigation buttons */}
      <div className="w-full flex justify-between mb-2">
        <button
          onClick={() => {
            navigate(-1);
            setTimeout(() => window.scrollTo(0, 0), 10);
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

      {/* Product container */}
      <div className="flex flex-col gap-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full">
        {/* Image gallery */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-full rounded-none overflow-hidden flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {product.images?.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.name}
                  className="object-contain rounded-none transition-opacity duration-300 ease-in-out"
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

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="hidden mt-4 md:flex flex-wrap justify-center gap-2">
              {product.images.map((image, index) => (
                <img
                  key={image.public_id || index}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-none cursor-pointer border-2 transition-all duration-200
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

        {/* Product details */}
        <div className="space-y-1">
          <div className="flex flex-wrap space-x-2 font-normal text-gray-500 items-center text-xs sm:text-base">
            <p className="capitalize">{product.category}</p>
          </div>
          <h1 className="text-3xl font-bold font-[inter] capitalize">
            {product.name}
          </h1>

          {/* Price display */}
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
          </div>

          <p>
            <b>Ingredients:</b> {product.ingredients}
          </p>

          {/* Action buttons */}
          {!isAdmin ? (
            <a
              className="my-4 btn bg-green-500 text-base-100 w-full rounded-none font-[inter] shadow-none border-0"
              href={whatsappHref(product)}
            >
              <img src={whatsapp} alt="" className="size-6" />
              Order Now
            </a>
          ) : null}

          {isAdmin && (
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
          )}

          {!isAdmin && (
            <div className="flex space-x-4 mb-6">
              <button
                className="btn btn-primary text-white flex-1 rounded-none border-none shadow-none font-[poppins] shadow-none border-0"
                onClick={() => handleAddToCart(product._id)}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShoppingCart size={20} />
                )}
                Add to Cart
              </button>
            </div>
          )}

          <p className="font-bold">Description</p>
          <p
            className="text text-gray-700 font-[montserrat]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>
        </div>
      </div>

      {/* Reviews section */}
      <div className="flex flex-col mt-2 gap-4 py-4 bg-base-100 px-4 rounded-none shadow-xl max-w-5xl w-full">
        <div>
          {authUser ? (
            <div>
              {!myReview ? (
                <h1 className="font-bold font-[inter] text-lg">
                  Leave a Review
                </h1>
              ) : null}

              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="flex items-center mb-4 space-x-2">
                  <span className="font-medium">Your Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer stroke-0 transition-colors duration-200 
          ${
            star <= reviewRating
              ? 'text-yellow-500 fill-yellow-500'
              : 'text-gray-500 fill-gray-300'
          }
        `}
                        onClick={() => {
                          setReviewRating(star);
                          setFormData((prev) => ({
                            ...prev,
                            reviewRating: star,
                          }));
                        }}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  name="reviewComment"
                  className="textarea textarea-bordered w-full resize-none rounded-none mb-4"
                  rows="4"
                  placeholder="Write your review here..."
                  value={formData.reviewComment}
                  onChange={handleChange}
                ></textarea>
                <button
                  className="btn btn-primary rounded-none shadow-none border-none text-white font-[inter] w-full"
                  onClick={() => {
                    if (myReview) {
                      handleEditReview();
                    } else {
                      handleAddReview();
                    }
                  }}
                >
                  {isAddingReview || isEditingReview ? (
                    <Loader2 className="animate-spin" />
                  ) : myReview ? (
                    'Update Review'
                  ) : (
                    'Submit Review'
                  )}
                </button>
                {myReview ? (
                  <button
                    className="btn btn-error border-none rounded-none w-full mt-2"
                    onClick={() => handleDeleteReview()}
                  >
                    {isDeletingReview ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      'Delete my Review'
                    )}
                  </button>
                ) : null}
              </form>
            </div>
          ) : null}
        </div>
        <h1 className="font-[inter] font-bold text-xl">Customer Reviews</h1>
        {product.reviews?.length > 0 ? (
          <div>
            {product.reviews.map((review) => (
              <div
                key={review._id || review.id}
                className=" p-2 border-1 rounded-none border-gray-300"
              >
                <div className="flex items-center space-x-2">
                  <h1 className="font-bold text-lg font-[inter]">
                    {review.name}
                  </h1>
                  <p className="text-sm">{formatTime(review.createdAt)}</p>
                </div>

                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`
                            ${
                              star <= review.rating
                                ? 'text-yellow-500 fill-yellow-500 stroke-0'
                                : 'text-gray-300 fill-gray-300 stroke-0'
                            }
                          `}
                    />
                  ))}
                </div>
                <h1>{review.comment}</h1>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
