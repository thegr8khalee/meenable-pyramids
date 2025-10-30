import React, { useEffect } from 'react';
import leaf from '../images/leaf.webp';
import hero from '../images/hero.webp';
import chilli from '../images/chilli.webp';
import seasoning from '../images/seasoning.webp';
import spice from '../images/spice.webp';
import white from '../images/white.webp';
import grey from '../images/grey.webp';
// import cardamom from '../images/cardamom.jpg';
// import recipe from '../images/recipe.png';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { useProductsStore } from '../store/useProductsStore';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/UseCartStore';
import { useAuthStore } from '../store/useAuthStore';

const LandingPage = () => {
  const navigate = useNavigate();

  const { recipes, getRecipes, isGettingRecipes } = useAdminStore();
  const { products, getProducts, isGettingProducts } = useProductsStore();
  const { addRecipeToCart, isAddingToCart, addToCart } = useCartStore();
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    getRecipes();
    getProducts();
  }, [getRecipes, getProducts]);

  const rod = recipes.filter((recipe) => recipe.isRecipeOfTheDay);
  console.log('Recipe of the Day:', rod);
  console.log('All Recipes:', recipes);

  const handleShop = () => {
    navigate('/shop');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleRecipes = () => {
    navigate('/recipes');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleProductClick = (Id) => {
    navigate(`/product/${Id}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleAddRecipeToCart = (id) => {
    addRecipeToCart(id);
  };

  const handleAddToCart = (id, quantity, type) => {
    addToCart(id, quantity, type);
  };

  const handleContact = () => {
    navigate('/contact');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleRecipeClick = (id) => {
    navigate(`/recipe/${id}`);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  };

  return (
    <div className="overflow-x-hidden">
      <section
        id="hero mobile"
        className="sm:hidden flex flex-col w-screen overflow-hidden"
      >
        <div
          id="hero-image"
          className="w-full max-h-[60vh] items-center justify-center flex"
        >
          <img src={hero} alt="" className="max-h-[70vh] object-cover" />
        </div>
        <div id="hero-cta" className="p-4">
          <h1 className="z-100 relative font-extrabold text-3xl font-[inter]">
            Your Culinary Journey Starts Here.
          </h1>
          <h2 className="w-70 text-lg mt-2">
            Creating new healthy recipes, spice blends, relishes and escabeches.
          </h2>
          <div className="w-full flex space-x-2 mt-4">
            <button
              className=" flex-1 btn btn-primary btn-outline rounded-none shadow-none font-[inter] "
              onClick={() => handleRecipes()}
            >
              View Recipes
            </button>
            <button
              className="flex-1 btn btn-primary rounded-none shadow-none border-none font-[inter] text-white"
              onClick={() => handleShop()}
            >
              Shop Now!
            </button>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-10 absolute top-80 left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-95 right-5 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-25 size-40 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="hero desktop"
        className="hidden sm:flex justify-between w-screen overflow-hidden"
      >
        <div id="hero-cta" className="pl-8 justify-center flex flex-col z-100">
          <h1 className="font-extrabold text-2xl md:text-4xl lg:text-6xl font-[inter]">
            Your Culinary Journey Starts Here.
          </h1>
          <h2 className="mt-2 text-lg">
            Creating new healthy recipes, spice blends, relishes and escabeches.
          </h2>
          {/* <label className="input pr-0 w-full border-0 mt-4 shadow-none"> */}
          <div className="w-full flex space-x-2 mt-4">
            <button
              className=" flex-1 btn btn-primary btn-outline rounded-none shadow-none font-[inter] "
              onClick={() => handleRecipes()}
            >
              View Recipes
            </button>
            <button
              className="flex-1 btn btn-primary rounded-none shadow-none border-none font-[inter] text-white"
              onClick={() => handleShop()}
            >
              Shop Now!
            </button>
          </div>

          {/* </label> */}
        </div>
        <div
          id="hero-image"
          className="min-w-[55vw] lg:min-w-[45vw] items-center justify-center lg:justify-end flex"
        >
          <img src={hero} alt="" className="h-[40vh] md:h-[60vh] lg:h-[70vh]" />
        </div>

        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-10 absolute top-20 left-90 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-45 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top- left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-80 md:top-100 lg:top-120 left-45 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-45 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-70 md:top-100 lg:top-120 right-5 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="relative mt-15 hidden sm:flex justify-center w-full items-center"
      >
        <div className="max-w-6xl gap-2 w-full flex">
          <a
            href="shop?view=chilli powder"
            className="text-center justify-center w-full items-center flex flex-col py-10 px-5 md:p-10"
          >
            {/* <div className="text-center justify-center w-full items-center flex flex-col py-10 px-5 md:p-10"> */}
            <div className="relative w-fit">
              <img src={grey} alt="" className="w-25" />
              <img
                src={chilli}
                alt=""
                className="size-25 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <h1 className="font-semibold text-l md:text-lg lg:text-xl tracking-wider">
              CILLI POWDER
            </h1>
            <p className="text-xs md:text-base">
              A kitchen staple with a balanced, smoky heat.
            </p>
            {/* </div> */}
          </a>
          <a
            href="/shop?view=spice"
            className="bg-primary text-center justify-center w-full items-center flex flex-col py-15 px-5"
          >
            <div className="relative w-fit">
              <img src={white} alt="" className="w-25" />
              <img
                src={spice}
                alt=""
                className="size-25 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <h1 className="font-semibold text-l md:text-lg lg:text-xl tracking-wider text-white">
              SPICES & BLENDS
            </h1>
            <p className="text-xs text-white md:text-base">
              Fresh spices. Handcrafted blends. Your culinary adventure starts
              here.
            </p>
          </a>
          <a
            href="/shop?view=seasoning"
            className="text-center justify-center w-full items-center flex flex-col py-10 px-5 md:p-10"
          >
            <div className="relative w-fit">
              <img src={grey} alt="" className="w-25" />
              <img
                src={seasoning}
                alt=""
                className=":size-25 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <h1 className="font-semibold text-l md:text-lg lg:text-xl tracking-wider">
              SEASONING
            </h1>
            <p className="text-xs md:text-base">
              Unlock a world of flavor. Simply shake, sprinkle, and savor.
            </p>
          </a>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top- left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="categories mobile"
        className="relative mt-15 flex sm:hidden justify-center w-full items-center"
      >
        <div className="max-w-6xl gap-2 w-full flex flex-col">
          <a
            href="/shop?view=chilli powder"
            className="text-center justify-center w-full items-center flex flex-col p-10 md:p-15"
          >
            <div className="relative w-fit">
              <img src={grey} alt="" className="w-15" />
              <img
                src={chilli}
                alt=""
                className="size-15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>

            <h1 className="font-semibold text-xl tracking-wider">
              CHILLI POWDER
            </h1>
            <p className="text-base">
              A kitchen staple with a balanced, smoky heat.
            </p>
          </a>
          <a
            href="/shop?view=spice"
            className="bg-primary text-center justify-center w-full items-center flex flex-col p-10 "
          >
            <div className="relative w-fit">
              <img src={white} alt="" className="w-15" />
              <img
                src={spice}
                alt=""
                className="size-15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <h1 className="font-semibold text-xl tracking-wider text-white">
              SPICES & BLENDS
            </h1>
            <p className="text-white">
              Fresh spices. Handcrafted blends. Your culinary adventure starts
              here.
            </p>
          </a>
          <a
            href="/shop?view=seasoning"
            className="text-center justify-center w-full items-center flex flex-col p-10 "
          >
            <div className="relative w-fit">
              <img src={grey} alt="" className="w-15" />
              <img
                src={seasoning}
                alt=""
                className="size-15 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <h1 className="font-semibold text-xl tracking-wider">SEASONING</h1>
            <p className="text">
              Unlock a world of flavor. Simply shake, sprinkle, and savor.
            </p>
          </a>
        </div>

        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-20 size-45 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-10 absolute top-80 left-[-60px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate- size-40 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-110 right-0 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section className=" relative my-10 px-8 w-full justify-center items-center flex">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-[inter]">
            We have made more than <b>50</b> spices and herbs
          </h1>
          <div className="flex w-full justify-between">
            <div>
              <p>
                Explore our diverse collection, expertly curated to inspire your
                culinary creations and elevate every meal.
              </p>
            </div>
            <div>
              <button
                className="hidden sm:flex btn btn-primary text-white shadow-none border-none rounded-none"
                onClick={() => handleRecipes()}
              >
                Explore
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {products.slice(0, 3).map((product, index) => (
              <div
                key={index}
                className="card shadow-lg rounded-none flex flex-col h-full"
              >
                <button onClick={() => handleProductClick(product._id)}>
                  <img
                    src={product.images[0].url}
                    alt=""
                    className="transition-transform duration-300 hover:scale-105 w-full h-70 sm:h-50 object-contain"
                  />

                  <div className="absolute top-3 left-3 space-y-1">
                    {product.isPromo &&
                    product.discountedPrice !== undefined ? (
                      <div className="text-white text-xs text-center font-semibold bg-green-500 rounded-full p-1">
                        {(
                          ((product.price - product.discountedPrice) /
                            product.price) *
                          100
                        ).toFixed(0)}
                        % OFF
                      </div>
                    ) : null}

                    {product.isBestSeller ? (
                      <div className="bg-primary rounded-full text-white p-1 text-xs font-medium">
                        Best Seller
                      </div>
                    ) : null}
                  </div>
                </button>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h3 className="font-[inter] font-bold capitalize">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className={`
                                              ${
                                                star <= product.averageRating
                                                  ? 'text-yellow-500 fill-yellow-500 stroke-0'
                                                  : 'text-gray-300 fill-gray-300 stroke-0'
                                              }
                                            `}
                        />
                      ))}
                    </div>
                    <h1 className="text-xs">({product.averageRating})</h1>
                  </div>
                  <div className="w-full justify-between flex items-center mt-1">
                    {product.isPromo &&
                    product.discountedPrice !== undefined ? (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-primary font-medium">
                            ₦
                            {Number(product.discountedPrice).toLocaleString(
                              'en-NG',
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                          <span className="text-gray-500 text-xs line-through text">
                            ₦
                            {Number(product.price).toLocaleString('en-NG', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-primary font-medium">
                        ₦
                        {Number(product.price).toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    )}
                    {!isAdmin ? <button
                      className="btn btn-primary btn-sm text-white rounded-none border-none shadow-none"
                      onClick={() => handleAddToCart(product._id, 1)}
                    >
                      <ShoppingCart />
                    </button> : null}
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="sm:hidden btn btn-lg btn-primary w-full mt-4 text-white border-none shadow-none rounded-none"
            onClick={() => handleRecipes()}
          >
            Explore
          </button>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 top-20 absolute right-[-40px] h-full hidden sm:flex">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-5 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-25 left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate- size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <div className="z-0 absolute top-230 right-0 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-45 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="recipe-of-the-day"
        className="relative md:hidden my-10 px-8 w-full justify-center items-center flex flex-col"
      >
        {/* Loading State */}
        {(isGettingRecipes || isGettingProducts) && (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Error State */}
        {!(isGettingRecipes || isGettingProducts) && recipes.length === 0 && (
          <div className="text-center py-10">
            <p>Failed to load recipes. Please try again later.</p>
          </div>
        )}

        {/* Success State */}
        {!(isGettingRecipes || isGettingProducts) && recipes.length > 0 && (
          <>
            {rod.length > 0 ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-full text-center mb-4">
                  <h1 className="text-2xl">
                    <b>Recipe</b> of the day
                  </h1>
                  <p>
                    Brighten your plate with these incredibly flavorful and
                    easy-to-make sweet potatoes. The perfect side dish for any
                    meal!
                  </p>
                </div>

                {/* Recipe Image */}
                <div className="h-[300px] sm:h-[500px] w-full">
                  <img
                    src={rod[0].image?.url}
                    alt={rod[0].name}
                    className="h-full w-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.src = 'path-to-fallback-image.jpg';
                    }}
                  />
                </div>

                {/* Recipe Details */}
                <div className="w-full mt-4">
                  <p className="text-2xl font-bold">{rod[0].name}</p>
                  {rod[0].description && (
                    <p
                      className="capitalize line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: rod[0].description }}
                    ></p>
                  )}

                  {/* Ingredients */}
                  {rod[0].ingredients?.length > 0 && (
                    <div className="w-full mt-4">
                      <h3 className="font-semibold mb-2">Ingredients:</h3>
                      <ul className="list-disc list-inside">
                        {rod[0].ingredients.map((item, index) => (
                          <li key={`${item.id || index}`}>{item.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex gap-2 mt-6">
                  <button
                    className="btn-lg shadow-none rounded-none flex-1 btn btn-primary btn-outline"
                    onClick={() => handleRecipeClick(rod[0]._id)}
                  >
                    View Recipe
                  </button>
                  {!isAdmin ? <button
                    className="btn-lg shadow-none rounded-none flex-1 btn btn-primary text-white"
                    onClick={() => handleAddRecipeToCart(rod[0])}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button> : null}
                  
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p>No recipe of the day available. Check back later!</p>
              </div>
            )}
          </>
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 top-20 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate- size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-10 absolute top-70 left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-140 right-[-50px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-120 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="recipe-of-the-day"
        className="relative hidden my-10 px-8 w-full justify-center items-center md:flex flex-col"
      >
        {/* Loading State */}
        {(isGettingRecipes || isGettingProducts) && (
          <div className="max-w-6xl w-full flex justify-center items-center h-[500px]">
            <span className="loading loading-spinner"></span>
          </div>
        )}

        {/* Error/Empty State */}
        {!(isGettingRecipes || isGettingProducts) &&
          (!recipes.length || !rod.length) && (
            <div className="max-w-6xl w-full text-center py-10">
              <p>No recipe of the day available</p>
            </div>
          )}

        {/* Success State */}
        {!(isGettingRecipes || isGettingProducts) && rod.length > 0 && (
          <div className="max-w-6xl">
            <div className="w-full text-center mb-4">
              <h1 className="text-2xl">
                <b>Recipe</b> of the day
              </h1>
              <p>
                Brighten your plate with these incredibly flavorful and
                easy-to-make sweet potatoes. The perfect side dish for any meal!
              </p>
            </div>

            <div className="flex">
              <div className="w-[500px] lg:w-[700px] m-2">
                <img
                  src={rod[0].image?.url || '/images/recipe-fallback.jpg'}
                  alt={rod[0].name || 'Recipe image'}
                  className="w-full rounded-2xl"
                  onError={(e) => {
                    e.target.src = '/images/recipe-fallback.jpg';
                  }}
                />
              </div>
              <div className="w-full h-auto justify-center flex flex-col">
                <p className="text-2xl lg:text-4xl font-bold">{rod[0].name}</p>
                {rod[0].description && (
                  <p
                    className="line-clamp-5"
                    dangerouslySetInnerHTML={{ __html: rod[0].description }}
                  ></p>
                )}
                {rod[0].ingredients?.length > 0 && (
                  <div className="w-full mt-4">
                    <h3 className="font-semibold mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside">
                      {rod[0].ingredients.map((item, index) => (
                        <li key={`${item.id || index}`}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="w-full flex gap-2 mt-2">
                  <button
                    className="btn-lg shadow-none rounded-none flex-1 btn btn-primary btn-outline"
                    onClick={() => handleRecipeClick(rod[0]._id)}
                  >
                    View Recipe
                  </button>
                  {!isAdmin ? <button
                    className="btn-lg shadow-none rounded-none flex-1 btn btn-primary text-white"
                    onClick={() => handleAddRecipeToCart(rod[0])}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button> : null}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 top-35 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-55 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-40 left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="cta"
        className="relative bg-primary py-20 flex justify-center text-white"
      >
        <div className="max-w-6xl space-y-2 px-4 w-full">
          <h1 className="text-4xl font-bold font-[inter]">
            Discover Your Next Flavor
          </h1>
          <h1 className="font-[inter]">
            From exotic single-origin spices to everyday essentials, find the
            perfect ingredients to elevate every dish.
          </h1>
          <div className="hidden sm:flex space-x-2">
            <button
              className="btn btn-white btn-outline btn-lg rounded-none shadow-none"
              onClick={() => handleContact()}
            >
              Contact Us
            </button>
            <button
              className="btn btn-white border-0 btn-lg rounded-none shadow-none text-primary"
              onClick={() => handleShop()}
            >
              Shop Now!
            </button>
          </div>

          <div className="flex sm:hidden space-x-2">
            <button className="flex-1 btn btn-white btn-outline btn-lg rounded-none shadow-none">
              Contact Us
            </button>
            <button
              className="flex-1 btn btn-white border-0 btn-lg rounded-none shadow-none text-primary"
              onClick={() => handleShop()}
            >
              Shop Now!
            </button>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-0 top-60 absolute right-0 sm:right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-120 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="z-0 absolute top-[-20px] left-[-45px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-180 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="hidden sm:flex z-0 absolute left-65 top-40 h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-80 size-35 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          <div className="hidden sm:flex z-0 absolute right-0  h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-120 size-45 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
              animate={{
                y: [0, -10, 0], // move up then back down
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
