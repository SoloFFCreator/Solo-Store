import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerPayments from "./pages/SellerPayments";
import SellerSettings from "./pages/SellerSettings";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";
import Admin from "./admin/Admin";
import AdminLogin from "./admin/AdminLogin";
import Profile, { AuthHandle } from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard/products" element={<SellerProducts />} />
              <Route path="/dashboard/orders" element={<SellerPayments />} />
              <Route path="/dashboard/settings" element={<SellerSettings />} />
              <Route path="/dashboard/purchases" element={<Purchases />} />
            </Route>
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth register />} />
          <Route path="/auth/handle" element={<AuthHandle />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
