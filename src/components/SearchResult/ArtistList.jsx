import { Link } from "react-router-dom";
import User from "../../images/User.png";
import PropTypes from "prop-types";

const ArtistList = ({ artists }) => {
  return (
    <div>
      {artists.map((artist) => (
        <div className="artistList" key={artist.id}>
          {artist.images.length > 0 ? (
            <img src={artist.images[2].url} alt="Artist Logo" />
          ) : (
            <img src={User} alt="Artist Logo" />
          )}
          <Link to={`/artist/${artist.id}`}>
            <h2>{artist.name}</h2>
          </Link>
          <hr></hr>
          {artist.genres.length > 0 ? (
            <p>
              <strong>Genres: </strong>
              {artist.genres.map((genre) => (
                <em key={genre}>{genre} / </em>
              ))}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
};

ArtistList.propTypes = {
  artists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      images: PropTypes.array.isRequired,
      name: PropTypes.string.isRequired,
      genres: PropTypes.array.isRequired,
    }),
  ).isRequired,
};

export default ArtistList;
