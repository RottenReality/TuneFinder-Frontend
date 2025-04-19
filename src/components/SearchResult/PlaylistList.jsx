
import User from '../../images/User.png'

const PlaylistList = ({playlists}) => {
  return(
    <div>
      {playlists.filter(Boolean).map(playlist => <div className="artistList" key={playlist.id}>
        {playlist.images.length > 0
          ? <img src={playlist.images[0].url} alt='playlist logo'/>
          : <img src={User} alt='playlist logo'/>}
          <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer"><h2>{playlist.name}</h2></a>
          <hr></hr>
          <p><strong>Owner: </strong>{playlist.owner.display_name}</p>
          <p><strong>Total tracks: </strong>{playlist.tracks.total}</p>
      </div>)}
    </div>
  )
}

export default PlaylistList