import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductPage from "./ProductPage";
import UserPage from "./UserPage";
import OrderPage from "./OrderPage";
import LoginPage from "./LoginPage";

function App() {

  const email = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>

      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand">Ecommerce Admin</span>

        <div>

          <Link to="/products" className="btn btn-outline-light me-2">
            Products
          </Link>

          <Link to="/users" className="btn btn-outline-light me-2">
            Users
          </Link>

          <Link to="/orders" className="btn btn-outline-light me-2">
            Orders
          </Link>

          {!email && (
            <Link to="/login" className="btn btn-warning">
              Login
            </Link>
          )}

          {email && (
            <>
              <span className="text-white me-3">👤 {email}</span>

              <button
                className="btn btn-danger"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </nav>

      <div className="container mt-4">

        <Routes>
          <Route path="/products" element={<ProductPage />} />

          <Route path="/users" element={<UserPage />} />

          <Route path="/orders" element={<OrderPage />} />

          <Route path="/login" element={<LoginPage />} />
        </Routes>

      </div>

    </Router>
  );
}

export default App;