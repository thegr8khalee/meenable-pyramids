// src/components/Navbar.jsx
import {
  HeartIcon,
  MenuIcon, // For mobile drawer and admin sidebar toggle
  SearchIcon,
  ShoppingCart,
  UserIcon, // For profile link
  X, // NEW: Import X icon for close button
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import LogoLightMode from '../images/logoLightMode.png';

import { useAuthStore } from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';
import { useCartStore } from '../store/UseCartStore';
// import { useCartStore } from '../store/useCartStore';
// import { useWishlistStore } from '../store/useWishlistStore';
// import { useProductsStore } from '../store/useProductsStore'; // No longer needed if categories are hardcoded here

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/admin/dashboard';
  const { authUser, isAdmin, isAuthReady } = useAuthStore();
  const { toggleSidebar, closeSidebar: closeAdminSidebar } = useAdminStore();
  const { getCart, cart } = useCartStore();
  // const { getwishlist, wishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthReady && !isAdmin) {
      getCart();
    }
  }, [getCart, isAuthReady, isAdmin]);

  // console.log(wishlist)

  // Hardcoded categories (moved from useProductsStore import)
  const uniqueCategories = [
    { id: '1', name: 'Spice', link: 'spice' },
    { id: '2', name: 'Herbs', link: 'herbs' },
    { id: '3', name: 'Seasoning', link: 'seasoning' },
    {id: '4', name: 'Chilli Powder', link: 'chilli powder'}
  ];

  const [isDrawerChecked, setIsDrawerChecked] = useState(false);
  // const [activeDrawerTab, setActiveDrawerTab] = useState('categories');

  const closeDrawer = () => {
    setIsDrawerChecked(false);
  };

  const handleDrawerCheckboxChange = (e) => {
    setIsDrawerChecked(e.target.checked);
    if (e.target.checked) {
      closeAdminSidebar();
    }
  };

  const handleCategoryLinkClick = (categoryLink) => {
    // Changed parameter name to avoid confusion
    navigate(`/shop?view=${categoryLink}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    closeDrawer();
  };

  const handleMobileSearchClick = () => {
    navigate('/shop', { state: { focusSearch: true } });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    closeDrawer();
  };

  const handleDesktopSearchClick = () => {
    navigate('/shop', { state: { focusSearch: true } });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  return (
    <div className="top-0 sticky z-999">
      {/* Mobile View Navbar (visible on lg screens and smaller) */}
      <div className="lg:hidden flex drawer drawer-start z-9999">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerChecked}
          onChange={handleDrawerCheckboxChange}
        />
        <div className="navbar backdrop-blur-lg bg-base-100/80 items-center w-full top-0 z-20 drawer-content">
          <div className="navbar-start">
            {isAdmin && isDashboard ? (
              <button
                className="pl-4 border-none"
                onClick={toggleSidebar}
                aria-label="Toggle admin sidebar"
              >
                <MenuIcon />
              </button>
            ) : (
              <label
                htmlFor="my-drawer"
                className="pl-4 border-none drawer-button"
                aria-label="Open main menu"
              >
                <MenuIcon />
              </label>
            )}
          </div>
          <div className="navbar-center">
            <Link to="/" onClick={closeDrawer}>
              <h1 className='text-lg font-[sarina]'>Meenable Pyramids</h1>
            </Link>
          </div>
          <div className="navbar-end">
            <button
              className="pr-4 border-none btn-ghost"
              onClick={handleMobileSearchClick}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
        <div className="drawer-side z-40">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={closeDrawer}
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-95 p-4">
            {/* Close Button */}
            <li className="flex justify-end p-2">
              <button
                onClick={closeDrawer}
                className="btn btn-ghost btn-circle"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </li>
            <div className="flex flex-col">
              <li>
                <Link
                  to="/"
                  className="btn btn-lg font-normal border-0 justify-start"
                  onClick={closeDrawer}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="btn btn-lg font-normal border-0 justify-start"
                  onClick={closeDrawer}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="btn btn-lg font-normal border-0 justify-start"
                  onClick={closeDrawer}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/recipes"
                  className="btn btn-lg font-normal border-0 justify-start"
                  onClick={closeDrawer}
                >
                 Recipes
                </Link>
              </li>
            </div>

            <>
              {uniqueCategories.map((category) => (
                <li key={category.id}>
                  {' '}
                  {/* FIX: Added key prop */}
                  <button
                    onClick={() => handleCategoryLinkClick(category.link)}
                    className="btn  font-normal btn-lg border-0 justify-start"
                  >
                    {category.name} {/* FIX: Render category.name */}
                  </button>
                </li>
              ))}
            </>

            {/* Other general navigation links (always visible) */}
          </ul>
        </div>
      </div>

      {/* Desktop View Navbar (hidden on lg screens and smaller) */}
      <div className="hidden lg:flex navbar backdrop-blur-lg bg-base-100/80 shadow-sm z-100">
        <div className="navbar-start">
          <Link to="/">
            <img
              src={
                'https://res.cloudinary.com/dqe64m85c/image/upload/v1753784164/logoLightMode_g6xdr7.png'
              }
              alt="Logo"
              className="h-12"
            />
          </Link>
        </div>
        <div className="navbar-center space-x-6">
          <Link to="/" className=" border-0 shadow-none btn-ghost">
            Home
          </Link>
          <Link to="/shop" className=" border-0 shadow-none btn-ghost">
            Shop
          </Link>
          <Link to="/recipes" className=" border-0 shadow-none btn-ghost">
           Recipes
          </Link>
          {/* <Link to="/showroom" className=" border-0 shadow-none btn-ghost">
            Showroom
          </Link> */}
          <Link to="/aboutUs" className=" border-0 shadow-none btn-ghost">
            About Us
          </Link>
        </div>
        <div className="navbar-end space-x-2">
          {authUser ? (
            <>
              {isAdmin && (
                <Link to="/admin/dashboard" className="btn btn-ghost">
                  Admin Dashboard
                </Link>
              )}
              {!isAdmin ? (
                <Link to="/profile" className="btn btn-ghost">
                  My Account
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <Link to="/profile" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/signup" className="btn btn-ghost">
                Signup
              </Link>
            </>
          )}
          <button
            className="btn btn-ghost"
            onClick={handleDesktopSearchClick}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          {!isAdmin ? (
            <div className="flex">
              <button
                className="relative btn btn-ghost"
                onClick={() => handleCartClick()}
              >
                {cart?.length !== 0 && cart !== null ? (
                  <div className="absolute right-1 top-0 bg-red-500 text-xs w-4 h-4 rounded-full flex justify-center items-center">
                    {cart?.length}
                  </div>
                ) : null}
                <ShoppingCart />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
