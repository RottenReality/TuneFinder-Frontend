import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import LogIn from "./components/LogIn";
import Home from "./components/Home";
import Menu from './components/Menu';
import { setUser } from './reducers/userReducer';
import SearchArtist from './components/SearchArtist';
import SearchGenre from './components/SearchGenre';
import ArtistPage from './components/ArtistPage';
import UserPage from './components/UserPage';
import UserFavorite from './components/UserFavorite';
import Callback from './components/Callback';

async function getUser(token, dispatch) {
  const { data } = await axios({
    method: 'get',
    url: 'https://api.spotify.com/v1/me',
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  dispatch(setUser(data));
  return data;
}

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken && !token) {
      dispatch({ type: 'SET_TOKEN', data: localToken });
    }
    if (token && !user) {
      getUser(token, dispatch);
    }
  }, [token, user, dispatch]);

  return (
    <Router>
      <div>
        {token ? <Menu /> : <LogIn />}
      </div>

      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/home" element={<Home />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/search-artist" element={<SearchArtist />} />
        <Route path="/search-genre" element={<SearchGenre />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/favorite" element={<UserFavorite />} />
        <Route path="/" element={<></>} />
      </Routes>
    </Router>
  );
};

export default App;