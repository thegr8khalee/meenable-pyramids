import React from 'react';
import leaf from '../images/leaf.png';
import hero from '../images/hero.png';
import chilli from '../images/chilli.png';
import seasoning from '../images/seasoning.png';
import spice from '../images/spice.png';
import white from '../images/white.png';
import grey from '../images/grey.png';
import cardamom from '../images/cardamom.jpg';
import recipe from '../images/recipe.png';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const LandingPage = () => {
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
          <label className="input pr-0 w-full border-0 mt-4 shadow-none">
            <input
              type="search"
              required
              placeholder="Search your ingredients"
              className="border-b-1 w-full text-base border-0 shadow-0"
            />
            <button className="btn btn-primary rounded-none shadow-none border-none font-[inter] text-white">
              Search
            </button>
          </label>
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
          <label className="input pr-0 w-full border-0 mt-4 shadow-none">
            <input
              type="search"
              required
              placeholder="Search your ingredients"
              className="border-b-1 w-full shadow-none"
            />
            <button className="btn btn-primary rounded-none shadow-none border-none font-[inter] text-white">
              Search
            </button>
          </label>
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
          <div className="text-center justify-center w-full items-center flex flex-col py-10 px-5 md:p-10">
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
          </div>
          <div className="bg-primary text-center justify-center w-full items-center flex flex-col py-15 px-5">
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
          </div>
          <div className="text-center justify-center w-full items-center flex flex-col py-10 px-5 md:p-10">
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
          <div className="text-center justify-center w-full items-center flex flex-col p-10 md:p-15">
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
          </div>
          <div className="bg-primary text-center justify-center w-full items-center flex flex-col p-10 ">
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
          </div>
          <div className="text-center justify-center w-full items-center flex flex-col p-10 ">
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
          </div>
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
              <button className="hidden sm:flex btn btn-primary text-white shadow-none border-none rounded-none">
                Explore
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="card shadow-lg text-center rounded-none flex flex-col h-full"
              >
                <img
                  src={cardamom}
                  alt=""
                  className="w-full h-70 sm:h-50 object-contain"
                />
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <h3 className="font-[inter] font-bold">CARDAMOM</h3>
                  <h1 className="text-xs">
                    The "Queen of Spices." Distinctive, fragrant, and essential
                    for unique flavor.
                  </h1>
                </div>
              </div>
            ))}
          </div>
          <button className="sm:hidden btn btn-lg btn-primary w-full mt-4 text-white border-none shadow-none rounded-none">
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
        <div className="w-full text-center mb-4">
          <h1 className="text-2xl">
            <b>Recipe</b> of the day
          </h1>
          <p>
            Brighten your plate with these incredibly flavorful and easy-to-make
            sweet potatoes. The perfect side dish for any meal!
          </p>
        </div>
        <div className="h-[300px] sm:h-[500px]">
          <img src={recipe} alt="" className="h-full" />
        </div>
        <div className="w-full">
          <p className="text-2xl font-bold">
            Smoky Roasted Sweet Potatoes with Cumin & Paprika
          </p>
          <p>
            Brighten your plate with these incredibly flavorful and easy-to-make
            sweet potatoes. The perfect side dish for any meal!
          </p>
          <div className="w-full">
            <ul className="list-disc list-inside w-full">
              <li>1 teaspoon ground cumin</li>
              <li>1 teaspoon smoked paprika</li>
              <li>1/2 teaspoon garlic powder</li>
              <li>Salt and freshly ground black pepper to taste</li>
              <li>Fresh cilantro or parsley, chopped</li>
            </ul>
          </div>
        </div>
        <div className="w-full flex gap-2 mt-2">
          <button className="btn-lg shadow-none rounded-none flex-1 btn btn-primary btn-outline">
            View Recipe
          </button>
          <button className="btn-lg shadow-none rounded-none flex-1 btn btn-primary text-white">
            Add to Cart
          </button>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 top-20 absolute right-[-40px] h-full">
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

          <div className="z-10 absolute top-70 left-[-45px] h-full">
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

          <div className="z-0 absolute top-140 right-[-50px] h-full">
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
        </div>
      </section>

      <section
        id="recipe-of-the-day"
        className="relative hidden my-10 px-8 w-full justify-center items-center md:flex flex-col"
      >
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
            <div className="w-[500px] lg:w-[700px]">
              <img src={recipe} alt="" className="w-full" />
            </div>
            <div className="w-full h-auto justify-center flex flex-col">
              <p className="text-2xl lg:text-4xl font-bold">
                Smoky Roasted Sweet Potatoes with Cumin & Paprika
              </p>
              <p>
                Brighten your plate with these incredibly flavorful and
                easy-to-make sweet potatoes. The perfect side dish for any meal!
              </p>
              <div className="w-full">
                <ul className="list-disc list-inside w-full">
                  <li>1 teaspoon ground cumin</li>
                  <li>1 teaspoon smoked paprika</li>
                  <li>1/2 teaspoon garlic powder</li>
                  <li>Salt and freshly ground black pepper to taste</li>
                  <li>Fresh cilantro or parsley, chopped</li>
                </ul>
              </div>

              <div className="w-full flex gap-2 mt-2">
                <button className="btn-lg shadow-none rounded-none flex-1 btn btn-primary btn-outline">
                  View Recipe
                </button>
                <button className="btn-lg shadow-none rounded-none flex-1 btn btn-primary text-white">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="z-10 top-35 absolute right-[-40px] h-full">
            <motion.img
              src={leaf}
              alt=""
              className="rotate-45 size-55 z-50 relative drop-shadow-[55px_55px_7px_rgba(0,0,0,0.2)]"
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

          <div className="z-0 absolute top-40 left-[-45px] h-full">
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
            <button className="btn btn-white btn-outline btn-lg rounded-none shadow-none">
              Contact Us
            </button>
            <button className="btn btn-white border-0 btn-lg rounded-none shadow-none text-primary">
              Shop Now!
            </button>
          </div>

          <div className="flex sm:hidden space-x-2">
            <button className="flex-1 btn btn-white btn-outline btn-lg rounded-none shadow-none">
              Contact Us
            </button>
            <button className="flex-1 btn btn-white border-0 btn-lg rounded-none shadow-none text-primary">
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
