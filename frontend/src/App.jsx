import { Routes, Route} from "react-router-dom"

import LoginPage from "./pages/LoginPage";
import StorePage from "./pages/StorePage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";



const App = () => {
  return(
      <Routes>
        <Route path="/login" element = {<LoginPage/>}/>
        <Route path="/store/:slug" element={<StorePage />}/>
        <Route path="/product/:productId" element={<ProductDetails />}/>
        <Route path="/cart" element={<CartPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/order-success" element={<OrderSuccess/>}/>
        <Route path="/vendor/dashboard" element={<VendorDashboard/>}/>
        <Route path={"/vendor/products"} element = {<VendorProducts/>}/>
      </Routes>
  )
}

export default App;