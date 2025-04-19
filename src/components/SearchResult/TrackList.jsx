import { Link } from "react-router-dom"
import Note from '../../images/Note.png'

const TrackList = ({tracks}) => {
  return(
    <div>
      {tracks.map(track => <div className="artistList" key={track.id}>
        {track.album.images.length > 0
          ? <img src={track.album.images[0].url} alt='album logo'/>
          : <img src={Note} alt='album logo'/>}
          <h2>{track.name}</h2>
          <hr></hr>
          <p><strong>Artists: </strong>{track.artists.map(artist => <Link key={artist.id} to={`/artist/${artist.id}`}>{artist.name} / </Link>)}</p>
          <p><strong>Album: </strong>{track.album.name}</p>
          <p><strong>Duration: </strong>{Math.floor((track.duration_ms/1000)/60)}:{Math.floor((track.duration_ms/1000)%60)} min</p>
      </div>)}
    </div>
  )
}

export default TrackList