// src/components/BottomNavbar.jsx
import React, { useEffect } from 'react';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  Heart,
  X,
  LayoutDashboard,
  HomeIcon,
  Plus,
  Minus,
  LucideHome,
} from 'lucide-react'; // Example icons
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Use Link for navigation, useLocation for active state
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/UseCartStore';
// import { useWishlistStore } from '../store/useWishlistStore';

const BottomNavbar = () => {
  const location = useLocation(); // Get current location to highlight active link
  const { isAdmin, isAuthReady } = useAuthStore();
  const { cart, getCart } = useCartStore();
  //   const { wishlist, getwishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthReady && !isAdmin) {
      getCart();
      //   getwishlist();
    }
  }, [getCart, isAuthReady, isAdmin]);
  // Define your navigation items
  const navItems = [
    // Example cart page
    {
      name: 'Home',
      icon: LucideHome,
      path: '/',
    },
    { name: 'Shop', icon: ShoppingBag, path: '/shop' }, // Example shop page
    {
      name: isAdmin ? 'Product' : 'Cart',
      icon: isAdmin ? Plus : ShoppingCart,
      path: isAdmin ? '/admin/products/new' : '/cart',
    }, // Example wishlist page
    {
      name: isAdmin ? 'Dasboard' : 'Profile',
      icon: isAdmin ? LayoutDashboard : User,
      path: isAdmin ? '/admin/dashboard' : '/profile',
    }, // Example profile page
  ];

  // console.log(wishlist);

  const navigate = useNavigate();
  const handleClick = (link) => {
    navigate(link);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-base-100 shadow-lg p-2 z-50 lg:hidden">
      {/* md:hidden makes it visible only on screens smaller than 'md' (768px) */}
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon; // Get the Lucide icon component

          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.path)}
              className={`relative flex flex-col items-center justify-center p-1 rounded-lg transition-colors duration-200
                                ${
                                  isActive
                                    ? 'text-primary'
                                    : 'text-accent hover:text-primary'
                                }`}
              aria-label={item.name}
            >
              <IconComponent size={24} className="mb-1" />
              {item.name === 'Cart' && cart?.length !== 0 && cart !== null ? (
                <div className="absolute right-0 top-0 bg-red-500 text-xs w-4 h-4 rounded-full flex justify-center items-center text-white">
                  {cart?.length}
                </div>
              ) : null}

              {/* console.log(wishlist) */}

              {/* {item.name === 'Wishlist' &&
              wishlist?.length !== 0 &&
              wishlist !== null ? (
                <div className="absolute right-0 top-0 bg-red-500 text-xs w-4 h-4 rounded-full flex justify-center items-center">
                  {wishlist?.length}
                </div>
              ) : null} */}

              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
