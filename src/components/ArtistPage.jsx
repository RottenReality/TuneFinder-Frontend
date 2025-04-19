import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import User from '../images/User.png'
import Note from '../images/Note.png'
import Star from '../images/Star.png'
import StarPress from '../images/StarPress.png'

const TrackList = (props) => {
  const [tracks, setTracks] = useState('')
  const token = useSelector(state => state.token)

  const fetchTracks = async (albumID) => {
    const {data} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${albumID}/tracks`,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setTracks(data)
  }

  useEffect(() => {
    fetchTracks(props.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id])

  if (!tracks) return null

  return(
    <div className='tracks'>
      {tracks.items.map(track => <div key={track.id}>
        <p>- {track.name}</p>
      </div>)}
    </div>
  )

}

const ArtistPage = () => {

  const [artist, setArtist] = useState('')
  const [albums, setAlbums] = useState('')
  const [similar, setSimilar] = useState('')
  const [img, setImg] = useState(Star)
  const token = useSelector(state => state.token)
  const user = useSelector(state => state.user)

  const fetchArtist = async () => {
    const {data} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${id}`,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setArtist(data)
  }

  const fetchAlbums = async () => {
    const {data} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${id}/albums`,
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${token}`
      }
    })

    setAlbums(data)
  }

  const fetchSimilarArtists = async () => {
    const {data} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${id}/related-artists`,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    setSimilar(data)
  }

  const id = useParams().id

  useEffect(() => {
    if (!artist) fetchArtist()
    if (!albums) fetchAlbums()
    if(!similar) fetchSimilarArtists()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albums, artist, similar])

  if (!token || !artist || !albums || !similar) return null

  const refresh = () => {
    setArtist('')
    setAlbums('')
    setSimilar('')
  }

  const onFavorite = async () => {
    if (img === Star) {
      setImg(StarPress)
    }
    else setImg(Star)
  }

  return (
    <div className="searchPage">
      <div className="search">
        <div className="generalInfo">
        {artist.images.length > 0
          ? <img src={artist.images[0].url} alt='Artist Logo'/>
          : <img src={User} alt='Artist Logo'/>}
          <h2>{artist.name}<span className="favButton"><button onClick={() => onFavorite()}><img src={img} alt=''/></button></span></h2>
          <hr />
          {artist.genres.length > 0
          ? <p><strong>Genres: </strong>{artist.genres.map(genre => <em key={genre}>{genre} / </em>)}</p>
          : null}
          <p><strong>Followers:  </strong><em>{artist.followers.total}</em></p>
        </div>
        <div className="albums">
            <h3>Albums</h3>
            {albums.items.map(album => <div className='album' key={album.id}>
              {album.images.length > 0
                ? <img src={album.images[0].url} alt='Artist Logo'/>
                : <img src={Note} alt='Artist Logo'/>}
              <h2>{album.name}</h2>
              <p><strong>Release date: </strong>{album.release_date}</p>
              <h3>Tracks</h3>
              <TrackList id={album.id}/>
            </div>)}
        </div>
        <div className="similarArtists">
          <h3>Similar Artists</h3>
          {similar.artists.map(artist => <div className="sartist" key={artist.id}>
            <center>
            {artist.images.length > 0
              ? <img src={artist.images[0].url} alt='Artist Logo'/>
              : <img src={User} alt='Artist Logo'/>}
              <Link to={`/artist/${artist.id}`} onClick={() => refresh()}><h4>{artist.name}</h4></Link>
            </center>
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default ArtistPage