import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLogin } from '../reducers/tokenReducer';

const Callback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchToken = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      const codeVerifier = localStorage.getItem('code_verifier');

      if (!code || !codeVerifier) return;

      try {
        const body = new URLSearchParams();
        body.append('client_id', '5c2e53056c7e4287bf2c92c8edf7a6ee');
        body.append('grant_type', 'authorization_code');
        body.append('code', code);
        body.append('redirect_uri', 'http://localhost:3000/callback');
        body.append('code_verifier', codeVerifier);

        const response = await axios.post('https://accounts.spotify.com/api/token', body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const token = response.data.access_token;
        window.localStorage.setItem('token', token);
        dispatch(userLogin(token));
        navigate('/home');
      } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
      }
    };

    fetchToken();
  }, [dispatch, navigate]);

  return <div>Logging in...</div>;
};

export default Callback;
