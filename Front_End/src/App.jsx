import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { AdminProvider } from "./context/AdminContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Body from "./pages/Body";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Order from "./pages/Order";
import Loader from "./components/Loader";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import AddProduct from "./pages/admin/AddProduct";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { Settings } from "lucide-react";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <AdminProvider>
        <ProductProvider>
          <CartProvider>
            <div className="min-h-screen">
              <Router>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedAdminRoute>
                        <ProductManagement />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/add"
                    element={
                      <ProtectedAdminRoute>
                        <AddProduct />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* Public Routes */}
                  <Route
                    path="/*"
                    element={
                      <div className="flex flex-col min-h-screen">
                        <Nav />
                        <div className="flex-grow overflow-y-auto max-h-[100vh]">
                          <Routes>
                            <Route path="/" element={<Body />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/order" element={<Order />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/signin" element={<Signin />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/settings" element={<Setting />} />
                            <Route path="/profile" element={<Profile />} />
                          </Routes>
                        </div>
                        <Footer />
                      </div>
                    }
                  />
                </Routes>
              </Router>
            </div>
          </CartProvider>
        </ProductProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
