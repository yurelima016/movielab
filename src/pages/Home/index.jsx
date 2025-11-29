import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [heroMovie, setHeroMovie] = useState(null);
  const [topFilms, setTopFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [featuredActor, setFeaturedActor] = useState(null);
  const [bestOfYear, setBestOfYear] = useState([]);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const currentYear = new Date().getFullYear();
        const [trendingData, genresData, upcomingData, topRatedData] =
          await Promise.all([
            api.get("/trending/movie/week", {
              params: {
                api_key: import.meta.env.VITE_API_KEY,
                language: "pt-BR",
              },
            }),
            api.get("/genre/movie/list", {
              params: {
                api_key: import.meta.env.VITE_API_KEY,
                language: "pt-BR",
              },
            }),
            api.get("/movie/upcoming", {
              params: {
                api_key: import.meta.env.VITE_API_KEY,
                language: "pt-BR",
                page: 1,
              },
            }),
            api.get("/discover/movie", {
              params: {
                api_key: import.meta.env.VITE_API_KEY,
                language: "pt-BR",
                primary_release_year: currentYear,
                sort_by: "vote_average.desc",
                "vote_count.gte": 500,
              },
            }),
          ]);

        const trendingList = trendingData.data.results;
        const featuredFilm = trendingList[0];

        setHeroMovie(featuredFilm);
        setTopFilms(trendingList.slice(1, 11));

        setCategories(genresData.data.genres);
        setUpcoming(upcomingData.data.results.slice(0, 10));
        setBestOfYear(topRatedData.data.results.slice(0, 3));

        if (featuredFilm) {
          const credits = await api.get(`/movie/${featuredFilm.id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
            },
          });
          setFeaturedActor(credits.data.cast[0]);
        }
        setLoading(false);
      } catch (error) {
        console.log("ERRO AO CARREGAR HOME:", error);
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    navigate(`/filmes?q=${search}`);
  };

  if (loading) return <div>Carregando MovieLab..</div>;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          borderBottom: "2px solid #333",
          paddingBottom: 20,
          marginBottom: 20,
        }}
      >
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pesquisar filme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {heroMovie && (
          <div style={{ marginTop: 20 }}>
            <h1>🔥 Destaque da Semana: {heroMovie.title}</h1>
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}/original/${
                heroMovie.backdrop_path
              }`}
              alt={heroMovie.title}
              style={{ width: "100%", maxWidth: 600 }}
            />
            <p>{heroMovie.overview}</p>
            <Link to={`/filme/${heroMovie.id}`}>Ver Detalhes</Link>
          </div>
        )}
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2>📈 Top 10 da Semana</h2>
        <div style={{ display: "flex", gap: 10, overflowX: "scroll" }}>
          {topFilms.map((film) => (
            <div key={film.id} style={{ minWidth: 150 }}>
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                  film.poster_path
                }`}
                alt={film.title}
                style={{ width: "100%" }}
              />
              <p>{film.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>📂 Navegue pelas Categorias</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.id}`}
              style={{
                padding: 10,
                background: "#333",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>📅 Que estão por vir...</h2>
        <div style={{ display: "flex", gap: 10, overflowX: "scroll" }}>
          {upcoming.map((film) => (
            <div key={film.id} style={{ minWidth: 150 }}>
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                  film.poster_path
                }`}
                alt={film.title}
                style={{ width: "100%" }}
              />
              <p>{film.title}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredActor && (
        <section style={{ marginBottom: 40, background: "#222", padding: 20 }}>
          <h2>⭐ Ator Destaque</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                featuredActor.profile_path
              }`}
              alt={featuredActor.name}
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
                objectFit: "cover",
              }}
            />
            <div>
              <h3>{featuredActor.name}</h3>
              <p>
                Protagonista de <strong>{heroMovie.title}</strong>
              </p>
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: 40 }}>
        <h2>🏆 Filmes mais bem avaliados do ano</h2>
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {bestOfYear.map((film, index) => (
            <div
              key={film.id}
              style={{
                textAlign: "center",
                border: "1px solid gold",
                padding: 10,
              }}
            >
              <h1 style={{ fontSize: 50 }}>#{index + 1}</h1>
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                  film.poster_path
                }`}
                alt={film.title}
                width={100}
              />
              <h3>{film.title}</h3>
              <p>Nota: {film.vote_average.toFixed(1)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
