import { useEffect, useState } from "react";

const LogIn = () => {
  const [loginUrl, setLoginUrl] = useState("");

  useEffect(() => {
    const generateCodeVerifier = () => {
      const array = new Uint32Array(56);
      window.crypto.getRandomValues(array);
      return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
    };

    const generateCodeChallenge = async (verifier) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    };

    const setupLogin = async () => {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      localStorage.setItem("code_verifier", codeVerifier);

      const CLIENT_ID = '5c2e53056c7e4287bf2c92c8edf7a6ee';
      const REDIRECT_URI = "http://localhost:3000/callback";
      const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
      const RESPONSE_TYPE = 'code';
      const SCOPE = 'user-read-private playlist-read-private user-read-currently-playing user-follow-read';

      const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}` +
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
        {loginUrl && (
          <a href={loginUrl}>
            Login with Spotify
          </a>
        )}
      </center>
    </div>
  );
};

export default LogIn;
