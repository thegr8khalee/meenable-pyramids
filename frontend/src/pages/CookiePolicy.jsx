import React from 'react';
// import Hero1 from '../images/Hero1.png';
// import ME from '../images/ME.png';
// import CEO from '../images/CEO.png';

const cookiePolicy = () => {
  return (
    <div className="bg-white text-gray-800 ">
      <div className="relative">
        <img
          src={
            'https://res.cloudinary.com/dqe64m85c/image/upload/v1753726979/Hero1_btyphr.jpg'
          }
          alt="Abstract geometric pattern background"
          className="object-cover h-40 w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="absolute bottom-15 left-1/2 -translate-x-1/2 mt-20 w-full mb-2 text-3xl font-bold text-center text-white font-[poppins]">
            Cookie Policy for Meenable Pyramids
          </h1>
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-[montserrat] w-full text-center">
            Effective Date: July 22, 2025
          </p>
        </div>
      </div>
      <div className="w-full justify-center flex">
        <div className="w-full space-y-2 flex flex-col p-4 max-w-7xl font-[montserrat]">
          <p className="mb-6">
            This Cookie Policy explains how Meenable Pyramids uses cookies and
            similar technologies on our website, meenablepyramids.com.
          </p>

          <h2 className="text-2xl font-[poppins] font-semibold mb-4">
            1. What are Cookies?
          </h2>
          <p className="mb-6">
            Cookies are small text files that are stored on your device
            (computer, tablet, or mobile) when you visit a website. They are
            widely used to make websites work more efficiently and to provide
            information to the site's owners. They enable features like
            remembering your login status or shopping cart contents.
          </p>

          <h2 className="text-2xl font-[poppins] font-semibold mb-4">
            2. How We Use Cookies
          </h2>
          <p className="mb-6">
            We use cookies and similar browser storage mechanisms for the
            following purposes:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li>
              <strong>Authentication:</strong> We use a secure cookie to keep
              you logged in as an authenticated user. This cookie contains a
              session identifier that verifies your identity on subsequent
              requests, so you don't have to log in every time you visit a new
              page. This is a strictly necessary cookie for the functionality of
              our website.
            </li>
            <li>
              <strong>Session Management:</strong> If you are not logged in, we
              use a session-based cookie to manage your shopping cart items.
              This cookie is temporary and is typically cleared when you close
              your browser.
            </li>
            <li>
              <strong>Shopping Cart Persistence:</strong> If you have an active
              guest session, we may use local storage to save your cart across
              different sessions, even if you close the browser. This is done
              with your explicit consent as part of our cookie banner. If you do
              not consent, your cart will not persist between browser sessions.
            </li>
          </ul>

          <h2 className="text-2xl font-[poppins] font-semibold mb-4">
            3. Your Choices
          </h2>
          <p className="mb-6">You have control over your cookie preferences.</p>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li>
              <strong>Browser Settings:</strong> Most web browsers allow you to
              control cookies through their settings. You can choose to accept
              or reject cookies, or to be notified when a cookie is being sent.
              However, please note that disabling certain cookies (especially
              those for authentication) may impact the functionality of our
              website and prevent you from being able to log in.
            </li>
            <li>
              <strong>Local Storage Management:</strong> You can manage or clear
              the data stored in your browser's local storage through your
              browser settings. Clearing local storage will remove your locally
              stored cart and wishlist data.
            </li>
          </ul>

          <h2 className="text-2xl font-[poppins] font-semibold mb-4">
            4. Changes to This Cookie Policy
          </h2>
          <p className="mb-6">
            We may update this Cookie Policy from time to time to reflect
            changes in our practices or for other operational, legal, or
            regulatory reasons. We will notify you of any significant changes by
            posting the new Cookie Policy on this page and updating the
            "Effective Date" at the top.
          </p>

          <h2 className="text-2xl font-semibold font-[poppins] mb-4">
            5. Contact Us
          </h2>
          <p className="mb-6">
            If you have any questions or concerns about this Cookie Policy,
            please contact us at:
          </p>
          <ul className="list-disc list-inside ml-4 mb-6">
            <li>
              Email:{' '}
              <a
                // href="mailto:pheezyhomesinteriors@gmail.com"
                className=" hover:underline"
              >
                your email here
              </a>
            </li>
            <li>
              Phone:{' '}
              <a  className=" hover:underline">
                your phone number here
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default cookiePolicy;
