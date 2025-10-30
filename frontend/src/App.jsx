import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import SignupPage from './pages/Signup';
import Contact from './pages/Contact';
// import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import AdminLoginProtectedRoute from './components/AdminLoginProtectedRoute';
import AdminLoginPage from './pages/AdminLogin';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './pages/Dashboard';
import AdminAddProductPage from './pages/AddProductPage';
import AdminEditProductPage from './pages/EditProductPage';
import { Toaster } from 'react-hot-toast';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/Cart';
import CookieConsentBanner from './components/CookieConsentBanner';
import BottomNavbar from './components/BottomNavbar';
import AdminAddRecipePage from './pages/AddRecipePage';
import AdminEditRecipePage from './pages/EditRecipePage';
import Recipes from './pages/Recipes';
import RecipePage from './pages/RecipePage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import PaymentFailure from './pages/PaymentFailure';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';

function App() {
  const { checkAuth, authUser, isAuthReady } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const whatsappPhoneNumber = '2348121900185'; // REPLACE WITH YOUR ACTUAL PHONE NUMBER
  // Your preset message (URL-encoded)
  const presetMessage = encodeURIComponent(
    "Hello, I'm interested in your products. I saw your website and would like to inquire more."
  );

  const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${presetMessage}`;

  console.log(authUser);
  return (
    <div>
      <main>
        <Navbar />
        <BottomNavbar />
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-error" element={<PaymentError />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <LoginPage />}
          />

          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/contact" element={<Contact />} />

          <Route element={<AdminLoginProtectedRoute />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/products/new"
              element={<AdminAddProductPage />}
            />
            <Route
              path="/admin/products/edit/:productId"
              element={<AdminEditProductPage />}
            />
            <Route path="/admin/recipe/new" element={<AdminAddRecipePage />} />
            <Route
              path="/admin/recipe/edit/:recipeId"
              element={<AdminEditRecipePage />}
            />
          </Route>
        </Routes>

        <Toaster />
      </main>
      {window.location.pathname !== '/admin/dashboard' && <Footer />}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-none size-20 border-none fixed bottom-25 lg:bottom-6 right-6 rounded-full shadow-lg transition-colors duration-200 z-40 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <img
          src={
            'https://res.cloudinary.com/dqe64m85c/image/upload/v1753784180/whatsapp_4401461_ahnu6k.png'
          }
          alt="WhatsApp Chat"
          className="w-full h-full object-contain"
        />
      </a>
      {!authUser && isAuthReady && <CookieConsentBanner />}
    </div>
  );
}

export default App;
