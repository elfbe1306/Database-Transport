import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { DashBoard } from "./Pages/DashBoard";
import PrivateRoute from "./components/PrivateRoute";
import { Product } from "./Pages/Product";
import { Branch_List } from "./Pages/Branch_List";
import { Branch_Product } from "./Pages/Branch_Product";
import { Branch_Product_Restock } from "./Pages/Branch_Product_Restock";

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<PrivateRoute> <DashBoard/> </PrivateRoute>}/>
        <Route path="/dashboard/product" element={<PrivateRoute> <Product/> </PrivateRoute>}/>
        <Route path="/dashboard/branch" element={<PrivateRoute> <Branch_List/> </PrivateRoute>}/>
        <Route path="/dashboard/branch-product/:branch_id" element={<PrivateRoute> <Branch_Product/> </PrivateRoute>}/>
        <Route path="/dashboard/branch-product/:branch_id/restock" element={<PrivateRoute> <Branch_Product_Restock/> </PrivateRoute>}/>
      </Routes>
    </div>
  );
}

export default App;

