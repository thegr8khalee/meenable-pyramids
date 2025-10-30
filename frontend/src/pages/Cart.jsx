/* eslint-disable no-unused-vars */
// src/pages/CartPage.jsx
// import spiceherbs from '../images/spices-herbs.webp';
import React, { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/UseCartStore';
import { Loader2, Trash2, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios.js';
import whatsapp from '../images/whatsapp.webp';
// import Hero1 from '../images/Hero1.png';
import { useAuthStore } from '../store/useAuthStore.js';
import { useCheckOutStore } from '../store/useCheckoutStore.js';

const CartPage = () => {
  const {
    cart,
    isGettingCart,
    isRemovingFromCart,
    isUpdatingCartItem,
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = useCartStore();

  const { isAuthReady, authUser } = useAuthStore();

  const { processCheckout, loading } = useCheckOutStore();

  const navigate = useNavigate();

  const [detailedCartItems, setDetailedCartItems] = useState([]);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [hasInitialCartLoaded, setHasInitialCartLoaded] = useState(false);

  // Ref to store the previous cart items to detect additions/removals
  const prevCartRef = useRef([]);

  useEffect(() => {
    if (isAuthReady) {
      getCart().then(() => {
        setHasInitialCartLoaded(true);
      });
    }
  }, [getCart, isAuthReady]);

  //   console.log(cart);

  // Effect to fetch detailed product info for each item in the cart
  useEffect(() => {
    const fetchItemDetails = async () => {
      // Only clear detailed items if cart is empty AND we are NOT currently fetching it.
      if (!hasInitialCartLoaded) {
        return;
      }

      // If cart is empty (and we've confirmed the initial load completed), clear detailed items.
      if (!cart || cart.length === 0) {
        setDetailedCartItems([]);
        setIsFetchingDetails(false);
        return;
      }

      // Extract all unique product IDs from the cart
      const productIds = cart.map((cartItem) => cartItem.item);

      if (productIds.length === 0) {
        setDetailedCartItems([]);
        setIsFetchingDetails(false);
        return;
      }

      setIsFetchingDetails(true); // Indicate that details are being fetched
      try {
        // --- BATCHED API CALL for products only ---
        const res = await axiosInstance.post('/cart/details-by-ids', {
          productIds,
        });

        const { products } = res.data;

        // Create a map for quick lookup of product details by ID
        const productMap = new Map(products.map((p) => [p._id, p]));

        // Map the original cart items to their detailed versions
        const fetchedDetails = cart.map((cartItem) => {
          const detail = productMap.get(cartItem.item);

          if (detail) {
            return {
              _id: cartItem._id, // Use the cart entry's unique ID for React list key
              item: cartItem.item, // The original product ID
              itemType: 'Product', // Hardcoded as we only handle products
              quantity: cartItem.quantity,
              ...detail, // Spread the fetched product details (name, price, images etc.)
              imageUrl: detail.images?.[0]?.url,
              displayPrice:
                detail.isPromo && detail.discountedPrice !== undefined
                  ? detail.discountedPrice
                  : detail.price,
            };
          } else {
            // Handle case where item details could not be found
            return {
              _id: cartItem._id,
              item: cartItem.item,
              itemType: 'Product',
              quantity: cartItem.quantity,
              name: `Unknown Product (ID: ${cartItem.item.substring(0, 6)}...)`,
              imageUrl: 'https://placehold.co/100x100/E0E0E0/333333?text=N/A',
              displayPrice: 0,
              error: true, // Mark this item as having an error
            };
          }
        });
        setDetailedCartItems(fetchedDetails);
      } catch (error) {
        console.error('Error fetching batched item details:', error);
        setDetailedCartItems(
          cart.map((cartItem) => ({
            _id: cartItem._id,
            item: cartItem.item,
            itemType: 'Product',
            quantity: cartItem.quantity,
            name: `Error loading product (ID: ${cartItem.item.substring(
              0,
              6
            )}...)`,
            imageUrl: 'https://placehold.co/100x100/E0E0E0/333333?text=Error',
            displayPrice: 0,
            error: true,
          }))
        );
      } finally {
        setIsFetchingDetails(false); // End fetching details
      }
    };

    fetchItemDetails();
    prevCartRef.current = cart;
  }, [cart, hasInitialCartLoaded]);

  // Handler for removing an item from the cart
  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  // Handler for clearing the entire cart
  const handleClearCart = async (e) => {
    e.preventDefault();
    await clearCart();
  };

  // Handler for updating item quantity
  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      if (window.confirm('Do you want to remove this item from your cart?')) {
        await updateCartItemQuantity(itemId, 'Product', newQuantity);
      }
    } else {
      await updateCartItemQuantity(itemId, 'Product', newQuantity);
    }
  };

  // Calculate overall total from detailed items
  const calculateOverallTotal = () => {
    return detailedCartItems.reduce((total, item) => {
      const itemPrice = item.displayPrice || 0;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const totalItemsInCart = detailedCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleShopClick = () => {
    navigate(`/shop`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const whatsappNumber = '2348121900185'; // REPLACE WITH YOUR ACTUAL PHONE NUMBER

  // Helper function to get the link for a product item
  const getItemLink = (item) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/product/${item.item}`;
  };

  // Function to construct the WhatsApp message with cart details
  const fullMessage = (items) => {
    let message =
      "Hello, I'd like to place an order for the following items from my cart:\n\n";

    items.forEach((item, index) => {
      const link = getItemLink(item);
      message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₦${
        item.displayPrice?.toFixed(2) || '0.00'
      }`;
      if (link) {
        message += `\n   Link: ${link}`;
      }
      message += `\n\n`;
    });

    message += `Total Price: ₦${calculateOverallTotal().toFixed(2)}\n`;
    message += `\nThank you!`;

    return encodeURIComponent(message);
  };

  // Construct the WhatsApp href for the entire cart
  const whatsappCartHref = () => {
    if (!detailedCartItems || detailedCartItems.length === 0) {
      return '#';
    }
    return `https://wa.me/${whatsappNumber}?text=${fullMessage(
      detailedCartItems
    )}`;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    userName: authUser?.username || '',
    deliveryAddress: '',
    phoneNumber: authUser?.phoneNumber || '',
    note: '',
    email: authUser?.email || '',
    // cart: cart, // Assuming 'cart' is a state or prop from your cart store
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new, empty FormData object
    const checkoutFormData = new FormData();

    // Append all fields from the formData state object
    checkoutFormData.append('username', formData.userName);
    checkoutFormData.append('email', formData.email);
    checkoutFormData.append('phoneNumber', formData.phoneNumber);
    checkoutFormData.append('deliveryAddress', formData.deliveryAddress);
    checkoutFormData.append('note', formData.note);

    // 🔴 IMPORTANT: Convert the cart array to a JSON string before appending
    checkoutFormData.append(
      'cart',
      JSON.stringify(useCartStore.getState().cart)
    );

    // Now, pass this complete FormData object to the checkout function
    processCheckout(checkoutFormData);
    // setIsOpen(false);
    // console.log(checkoutFormData);
  };

  if (isGettingCart) {
    return (
      <div className="">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden font-[inter]">
      <div className="relative">
        <img
          src='https://res.cloudinary.com/dn2tbatgr/image/upload/v1761828422/spices-herbs_a3v9xo.webp'
          alt=""
          className="object-cover h-20 sm:h-40 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 mt-20 w-full mb-2 text-3xl font-bold text-center text-base-100 font-[inter]">
            Your Shopping Cart
          </h1>
        </div>
      </div>
      <div className="container mx-auto p-2 sm:p-6 lg:p-8 w-full">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Cart Items List */}
          <div className="flex-1 bg-base-100 p-2 rounded-none shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">
              Items ({totalItemsInCart})
            </h2>
            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
              {detailedCartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex border-b border-base-200 pb-4 last:border-b-0 overflow-x-auto"
                >
                  <div className="w-35 h-24">
                    <img
                      src={
                        item.imageUrl ||
                        'https://placehold.co/100x100/E0E0E0/333333?text=N/A'
                      }
                      alt={item.name}
                      className="h-full w-full object-cover rounded-lg mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://placehold.co/100x100/E0E0E0/333333?text=Error';
                      }}
                    />
                  </div>
                  <div className="flex flex-col w-full px-2">
                    <div className="flex justify-between w-full items-center font-[poppins]">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <button
                        type="button"
                        className="btn btn-xs btn-circle"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className=" flex justify-between w-full items-center"></div>{' '}
                    <div className="flex items-end space-x-1 justify-between w-full">
                      <div className="text font-[montserrat]">
                        ₦
                        {item.displayPrice !== undefined &&
                        item.displayPrice !== null
                          ? Number(item.displayPrice).toLocaleString('en-NG', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : '0.00'}
                      </div>
                    </div>
                    <div className="space-x-2 flex items-center w-full justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.item, item.quantity, -1)
                        }
                        className="btn btn-circle btn-sm btn-outline btn-primary"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold text-lg w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(item.item, item.quantity, 1)
                        }
                        className="btn btn-circle btn-sm btn-outline btn-primary"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!cart || cart.length === 0 ? (
              <div className="text-center text-xl text-gray-600 mt-16">
                Your cart is empty.{' '}
                <button
                  className="btn bg-primary text-white rounded-none"
                  onClick={() => handleShopClick()}
                >
                  Start shopping!
                </button>
              </div>
            ) : null}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClearCart}
                className="btn btn-error rounded-none"
                disabled={isRemovingFromCart || !cart || cart.length === 0}
              >
                {isRemovingFromCart ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Trash2 size={20} className="mr-2" />
                )}
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {cart && cart.length > 0 ? (
            <div className="lg:w-1/3 bg-base-100 p-6 rounded-none shadow-xl justify-between flex flex-col">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({totalItemsInCart} items)</span>
                    <span className="font-medium">
                      ₦
                      {Number(calculateOverallTotal()).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Delivery fee</span>
                    <span className="font-medium">₦1,000</span>
                  </div>
                  {/* <div className="border-t border-base-200 my-4"></div> */}
                </div>
              </div>
              <div className="">
                <div className="flex justify-between text-xl font-bold text-red-500">
                  <span>Total</span>
                  <span>
                    ₦
                    {Number(calculateOverallTotal() + 1000).toLocaleString(
                      'en-NG',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
                {/* Checkout Button */}
                <button
                  className="btn btn-primary border-0 shadow-none rounded-none text-white w-full"
                  onClick={() => setIsOpen(true)}
                >
                  Checkout
                </button>

                {/* Modal */}
                {isOpen && (
                  <div className="modal modal-open">
                    <div className="modal-box rounded-none">
                      <h2 className="text-2xl font-semibold mb-4">
                        Checkout Details
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block font-medium">Name</label>
                          <input
                            type="text"
                            name="userName"
                            className="input input-bordered w-full rounded-none"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium">
                            Delivery Address
                          </label>
                          <textarea
                            name="deliveryAddress"
                            className="textarea textarea-bordered w-full rounded-none"
                            value={formData.deliveryAddress}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>

                        <div>
                          <label className="block font-medium">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full rounded-none"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="input input-bordered w-full rounded-none"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-medium">Note</label>
                          <textarea
                            name="note"
                            className="textarea textarea-bordered w-full rounded-none"
                            value={formData.note}
                            onChange={handleChange}
                          ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="btn btn-ghost rounded-none"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary rounded-none shadow-none border-none text-white"
                          >
                            {loading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              'Proceed to Payment'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <a
                  className="btn bg-green-500 text-white border-0 shadow-none w-full mt-2 rounded-none"
                  href={whatsappCartHref(detailedCartItems)}
                  disabled={isRemovingFromCart || !cart || cart.length === 0}
                >
                  <img src={whatsapp} alt="" className="size-8" /> Order On
                  WhatsApp
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
