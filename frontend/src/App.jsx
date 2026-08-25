import {BrowserRouter, Routes, Route} from "react-router-dom"

import StorePage from "./pages/StorePage";
import ProductDetails from "./pages/ProductDetails";


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/store/:slug" element={<StorePage />}/>
        <Route path="/product/:productId" element={<ProductDetails />}
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;