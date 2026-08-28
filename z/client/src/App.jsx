import { useAuth } from "./context/AuthContext.jsx";
import GoogleLoginButton from "./components/GoogleLoginButton.jsx";
import { Routes, Route, Link } from 'react-router-dom';
import { apiFetch } from "./api.js";

import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";

const App = () => {
  const { user, loading, handleLogin, logout } = useAuth();

  if (loading) {
    return (
      <main style={{ textAlign: "center", padding: "40px" }}>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Multivendor Marketplace</h1>
        {user && (
          <nav style={{ display: "flex", gap: "15px" }}>
            <Link to="/products">Products</Link>
            <Link to="/cart">My Cart</Link>
          </nav>
        )}
      </header>

      {!user ? (
        <section style={{ marginTop: "20px" }}>
          <h2>Welcome</h2>
          <p>Sign in to access the marketplace.</p>
          <GoogleLoginButton onSuccess={handleLogin} />
          {import.meta.env.DEV && (
            <button 
              id="mock-login-btn"
              onClick={async () => {
                try {
                  const result = await apiFetch("/api/auth/mock-login", {
                    method: "POST",
                    body: JSON.stringify({ role: "buyer" }),
                  });
                  handleLogin(result.user);
                } catch (error) {
                  console.error("Mock login error:", error);
                }
              }}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "block"
              }}
            >
              Mock Login (Buyer)
            </button>
          )}
        </section>
      ) : (
        <>
          <section style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", margin: "20px 0" }}>
            <h2>Welcome, {user.name}</h2>
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                width="60"
                height="60"
                style={{ borderRadius: "50%" }}
              />
            )}
            <p>Email: {user.email} | Role: <strong>{user.role}</strong></p>
            <button onClick={logout}>Logout</button>
          </section>

          {/* Routes are now correctly contained within the styled layout */}
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </>
      )}
    </main>
  );
};

export default App;
