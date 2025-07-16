import "./App.css";
import Login from "./login";
import Home from "./home";
import ProtectedRoute from "./ProtectedRoute";
import { Routes, Route } from "react-router";
import Favorites from "./favorite.jsx";
import Sell from "./sell.jsx";
import Details from "./components/details.jsx";
import Test from "./test.jsx";
function App() {
  return (
    <Routes>
      {/* Unprotected route */}
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<Test/>}></Route>

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <Sell />
          </ProtectedRoute>
        }
      />
      <Route path="/details/:id" element={
        <ProtectedRoute>
          <Details />
        </ProtectedRoute>} />
    </Routes>
  );
}

export default App;
