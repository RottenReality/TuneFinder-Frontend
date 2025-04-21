import User from "../../images/User.png";
import PropTypes from "prop-types";

const PlaylistList = ({ playlists }) => {
  return (
    <div>
      {playlists.filter(Boolean).map((playlist) => (
        <div className="artistList" key={playlist.id}>
          {playlist.images.length > 0 ? (
            <img src={playlist.images[0].url} alt="playlist logo" />
          ) : (
            <img src={User} alt="playlist logo" />
          )}
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>{playlist.name}</h2>
          </a>
          <hr></hr>
          <p>
            <strong>Owner: </strong>
            {playlist.owner.display_name}
          </p>
          <p>
            <strong>Total tracks: </strong>
            {playlist.tracks.total}
          </p>
        </div>
      ))}
    </div>
  );
};

PlaylistList.propTypes = {
  playlists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      images: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      external_urls: PropTypes.shape({
        spotify: PropTypes.string.isRequired,
      }).isRequired,
      owner: PropTypes.shape({
        display_name: PropTypes.string.isRequired,
      }).isRequired,
      tracks: PropTypes.shape({
        total: PropTypes.number.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};

export default PlaylistList;
