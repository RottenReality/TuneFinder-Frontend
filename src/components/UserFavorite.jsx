import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import ArtistList from "./SearchResult/ArtistList"

const UserFavorite = () => {

  const [favorites, setFavorites] = useState('')
  const token = useSelector(state => state.token)
  const user = useSelector(state => state.user)

  const fetchFavorites = async favorites => {

    const { data } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/artists',
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: favorites.toString()
      }
    })

    setFavorites(data.artists)
  }

  if (!token || !user || !favorites) return null

  return (
    <div className="searchPage">
      <div className="search">
        <center>
          <h2 className="title">Favorite Artists</h2>
        </center>
        <ArtistList artists={favorites} />
      </div>
    </div>
  )

}

export default UserFavorite