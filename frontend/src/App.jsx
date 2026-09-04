import { Routes, Route} from "react-router-dom"

import LoginPage from "./pages/LoginPage";
import StorePage from "./pages/StorePage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import MyStore from "./pages/vendor/MyStore";
import EditStore from "./pages/vendor/EditStore";
import VendorOrders from "./pages/vendor/VendorOrders";
import MyOrders from "./pages/customer/MyOrders";



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
        <Route path="/vendor/products/new" element = {<AddProduct/>}/>
        <Route path="/vendor/products/edit/:id" element={<EditProduct/>}/>
        <Route path="/vendor/store" element={<MyStore/>}/>
        <Route path="/vendor/store/edit" element={<EditStore/>}/>
        <Route path="/vendor/orders" element={<VendorOrders/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
      </Routes>
  )
}

export default App;