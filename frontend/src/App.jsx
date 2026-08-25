import { Routes, Route} from "react-router-dom"

import StorePage from "./pages/StorePage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";



const App = () => {
  return(
      <Routes>
        <Route path="/store/:slug" element={<StorePage />}/>
        <Route path="/product/:productId" element={<ProductDetails />}/>
        <Route path="/cart" element={<CartPage/>}/>
      </Routes>
  )
}

export default App;