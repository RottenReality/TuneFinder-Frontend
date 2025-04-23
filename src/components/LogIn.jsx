import { useEffect, useState } from "react";
import { sha256 } from "js-sha256";

const LogIn = () => {
  const [loginUrl, setLoginUrl] = useState("");
  const redirect_uri = import.meta.env.APP_BASE_URL + "/callback" || "http://localhost:5173/callback"

  useEffect(() => {
    const generateCodeVerifier = () => {
      const array = new Uint32Array(56);
      window.crypto.getRandomValues(array);
      return Array.from(array, (dec) =>
        ("0" + dec.toString(16)).slice(-2),
      ).join("");
    };

    const generateCodeChallenge = async (verifier) => {
      const digest = sha256.arrayBuffer(verifier);
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    };

    const setupLogin = async () => {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      localStorage.setItem("code_verifier", codeVerifier);

      const CLIENT_ID = import.meta.env.VITE_SPOTIFY_TOKEN;
      const REDIRECT_URI = redirect_uri;
      const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
      const RESPONSE_TYPE = "code";
      const SCOPE =
        "user-read-private playlist-read-private user-read-currently-playing user-follow-read";

      const url =
        `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}` +
        `&response_type=${RESPONSE_TYPE}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(SCOPE)}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${codeChallenge}`;

      setLoginUrl(url);
    };

    setupLogin();
  }, []);

  return (
    <div className="login">
      <center>
        <h1>Log In to Continue</h1>
        {loginUrl && <a href={loginUrl}>Login with Spotify</a>}
      </center>
    </div>
  );
};

export default LogIn;
