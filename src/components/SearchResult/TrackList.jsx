import { Link } from "react-router-dom";
import Note from "../../images/Note.png";
import PropTypes from "prop-types";

const TrackList = ({ tracks }) => {
  return (
    <div>
      {tracks.map((track) => (
        <div className="artistList" key={track.id}>
          {track.album.images.length > 0 ? (
            <img src={track.album.images[0].url} alt="album logo" />
          ) : (
            <img src={Note} alt="album logo" />
          )}
          <h2>{track.name}</h2>
          <hr></hr>
          <p>
            <strong>Artists: </strong>
            {track.artists.map((artist) => (
              <Link key={artist.id} to={`/artist/${artist.id}`}>
                {artist.name} /{" "}
              </Link>
            ))}
          </p>
          <p>
            <strong>Album: </strong>
            {track.album.name}
          </p>
          <p>
            <strong>Duration: </strong>
            {Math.floor(track.duration_ms / 1000 / 60)}:
            {Math.floor((track.duration_ms / 1000) % 60)} min
          </p>
        </div>
      ))}
    </div>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration_ms: PropTypes.number.isRequired,
      album: PropTypes.shape({
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }).isRequired,
      artists: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
};

export default TrackList;
