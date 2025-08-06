import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/navbar';
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

function App() {
  const { checkAuth, authUser, isAdmin, isAuthReady } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <LoginPage />}
          />

          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to={'/'} />}
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
          </Route>
        </Routes>
        <Footer />
        <Toaster />
      </main>
    </div>
  );
}

export default App;
