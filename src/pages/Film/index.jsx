import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

function Film() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signed } = useContext(AuthContext);

  const [film, setFilm] = useState({});
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllData() {
      try {
        const [detailData, videoData, creditData] = await Promise.all([
          api.get(`/movie/${id}`, {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
            },
          }),
          api.get(`/movie/${id}/videos`, {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
            },
          }),
          api.get(`/movie/${id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
            },
          }),
        ]);

        setFilm(detailData.data);

        const trailerOficial = videoData.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailerOficial) {
          setTrailer(trailerOficial.key);
        } else if (videoData.data.results.length > 0) {
          setTrailer(videoData.data.results[0].key);
        }

        setCast(creditData.data.cast.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.log("FILME NÃO ENCONTRADO", error);
        navigate("/", { replace: true });
        return;
      }
    }

    loadAllData();
  }, [navigate, id]);

  async function saveFilm() {
    if (!signed) {
      alert("Você precisa estar logado para salvar filmes!");
      navigate("/login");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          favorites: arrayUnion({
            id: film.id,
            title: film.title,
            poster_path: film.poster_path,
            vote_average: film.vote_average,
          }),
        },
        { merge: true }
      );
      alert("Filme salvo com sucesso!");
    } catch (error) {
      console.log("ERRO AO SALVAR:", error);
      alert("Erro ao salvar. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Carregando detalhes...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <img
        src={`${import.meta.env.VITE_API_IMAGE_URL}/original/${
          film.backdrop_path
        }`}
        alt={film.title}
        style={{ width: "100%", borderRadius: 10, marginBottom: 20 }}
      />

      <h1>{film.title}</h1>
      <p style={{ fontStyle: "italic", color: "#BD8C34" }}>{film.tagline}</p>

      <hr style={{ margin: "20px 0" }} />

      <button
        onClick={saveFilm}
        style={{ padding: "10px 20px", cursor: "pointer", fontSize: 16 }}
      >
        ❤️ Salvar nos Favoritos
      </button>

      <br />
      <br />

      <h3>Sinopse</h3>
      <p style={{ lineHeight: 1.5 }}>{film.overview}</p>

      <p>
        <strong>Nota:</strong> {film.vote_average?.toFixed(1)} / 10
      </p>

      {trailer && (
        <div style={{ marginTop: 30 }}>
          <h3>Trailer Oficial</h3>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 10 }}
          ></iframe>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h3>Elenco Principal</h3>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          {cast.map((actor) => (
            <div key={actor.id} style={{ width: 100, textAlign: "center" }}>
              {actor.profile_path ? (
                <img
                  src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                    actor.profile_path
                  }`}
                  alt={actor.name}
                  style={{
                    width: "100%",
                    borderRadius: 50,
                    height: 100,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: "#333",
                    borderRadius: 50,
                  }}
                ></div>
              )}
              <p style={{ fontSize: 12, marginTop: 5 }}>{actor.name}</p>
              <p style={{ fontSize: 10, color: "#aaa" }}>{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Film;
