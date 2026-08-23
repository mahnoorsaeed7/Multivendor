import { useEffect, useRef } from "react";
import { apiFetch } from "../api";

const GoogleLoginButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || !buttonRef.current) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID is not set in environment variables.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const result = await apiFetch("/api/auth/google", {
              method: "POST",
              body: JSON.stringify({ credential: response.credential }),
            });
            onSuccess(result.user);
          } catch (error) {
            console.error("Google login failed:", error);
          }
        },
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 280,
      });
    };

    // Load Google script dynamically if not present
    if (window.google) {
      initializeGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, [onSuccess]);

  return <div ref={buttonRef} />;
};

export default GoogleLoginButton;