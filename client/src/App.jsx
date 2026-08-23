import { useAuth } from "./context/AuthContext";
import GoogleLoginButton from "./components/GoogleLoginButton";

const App = () => {
  const {
    user,
    loading,
    handleLogin,
    logout,
  } = useAuth();

  if (loading) {
    return (
      <main>
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
      <h1>Multivendor</h1>

      {!user ? (
        <section>
          <h2>Welcome</h2>

          <p>
            Sign in to access the marketplace.
          </p>

          <GoogleLoginButton
            onSuccess={handleLogin}
          />
        </section>
      ) : (
        <section>
          <h2>Welcome, {user.name}</h2>

          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              width="80"
              height="80"
              style={{
                borderRadius: "50%",
              }}
            />
          )}

          <p>
            Email: {user.email}
          </p>

          <p>
            Role: <strong>{user.role}</strong>
          </p>

          <button onClick={logout}>
            Logout
          </button>

          <hr />

          <h3>Application State</h3>

          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
};

export default App;