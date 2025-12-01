import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./Home.module.css";

const genreColors = {
  Documentário: "#083F34",
  Ação: "#E74C3C",
  Thriller: "#2C3E50",
  Mistério: "#6C5CE7",
  Terror: "#2D3436",
  Guerra: "#556B2F",
  Faroeste: "#D35400",
  Drama: "#3498DB",
  Fantasia: "#9B59B6",
  Crime: "#636E72",
  História: "#BFA376",
  Aventura: "#E67E22",
  "Ficção científica": "#00CEC9",
  Animação: "#FD79A8",
  "Cinema TV": "#95A5A6",
  Música: "#44300D",
  Comédia: "#F1C40F",
  Família: "#00B894",
  Romance: "#FF6B81",
};

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

  const categoryCarousel = useRef(null);

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

          const principal = credits.data.cast[0];

          if (principal) {
            const actorDetails = await api.get(`/person/${principal.id}`, {
              params: {
                api_key: import.meta.env.VITE_API_KEY,
                language: "pt-BR",
              },
            });
            setFeaturedActor(actorDetails.data);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log("ERRO AO CARREGAR HOME:", error);
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Função de Busca
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;
    navigate(`/filmes?q=${search}`);
  };

  // Funções das Setas de Categoria
  const handleLeftClick = (e) => {
    e.preventDefault();
    categoryCarousel.current.scrollLeft -= categoryCarousel.current.offsetWidth;
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    categoryCarousel.current.scrollLeft += categoryCarousel.current.offsetWidth;
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando MovieLab...</div>;

  return (
    <div className={styles.container}>
      {/* --- HERO SECTION --- */}
      {heroMovie && (
        <div
          className={styles.heroWrapper}
          style={{
            backgroundImage: `url(${
              import.meta.env.VITE_API_IMAGE_URL
            }/original/${heroMovie.backdrop_path})`,
          }}
        >
          <div className={styles.heroContent}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Pesquisar filme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn}>
                <i className="bi bi-search"></i>
              </button>
            </form>

            <h1 className={styles.heroTitle}>{heroMovie.title}</h1>
            <p className={styles.heroDesc}>{heroMovie.overview}</p>

            <Link to={`/filme/${heroMovie.id}`} className={styles.heroBtn}>
              Ver Detalhes
            </Link>
          </div>
        </div>
      )}

      {/* --- TOP 10 DA SEMANA --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📈 Top 10 da Semana</h2>
        <div className={styles.carousel}>
          {topFilms.map((film) => (
            <Link
              to={`/filme/${film.id}`}
              key={film.id}
              className={styles.card}
            >
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                  film.poster_path
                }`}
                alt={film.title}
                className={styles.cardImg}
              />
              <p className={styles.cardTitle}>{film.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- CATEGORIAS --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📂 Navegue pelas Categorias</h2>

        <div className={styles.carouselContainer}>
          <button className={styles.arrowLeft} onClick={handleLeftClick}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className={styles.categoryCarousel} ref={categoryCarousel}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.id}`}
                className={styles.categoryTag}
                style={{
                  backgroundColor: genreColors[cat.name] || "#333",
                  borderColor: genreColors[cat.name] || "#444",
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <button className={styles.arrowRight} onClick={handleRightClick}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* --- QUE ESTÃO POR VIR --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 Que estão por vir...</h2>
        <div className={styles.carousel}>
          {upcoming.map((film) => (
            <Link
              to={`/filme/${film.id}`}
              key={film.id}
              className={styles.card}
            >
              <img
                src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                  film.poster_path
                }`}
                alt={film.title}
                className={styles.cardImg}
              />
              <p className={styles.cardTitle}>{film.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- ATOR DESTAQUE --- */}
      {featuredActor && (
        <section className={styles.actorSection}>
          <h2 className={styles.actorTitle}>Ator destaque</h2>

          <div className={styles.actorContent}>
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                featuredActor.profile_path
              }`}
              alt={featuredActor.name}
              className={styles.actorImg}
            />

            <div className={styles.actorInfo}>
              <h3 className={styles.actorName}>{featuredActor.name}</h3>

              <p className={styles.actorBio}>
                {featuredActor.biography ||
                  "Biografia não disponível em português."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- PÓDIO --- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏆 Melhores do Ano</h2>
        <div className={styles.podiumContainer}>
          {[bestOfYear[1], bestOfYear[0], bestOfYear[2]].map((film, index) => {
            if (!film) return null;

            let height = "250px";
            let borderColor = "#CD7F32";
            let rank = 3;

            if (index === 1) {
              height = "320px";
              borderColor = "#FFD700";
              rank = 1;
            } else if (index === 0) {
              height = "280px";
              borderColor = "#C0C0C0";
              rank = 2;
            }

            return (
              <Link
                to={`/filme/${film.id}`}
                key={film.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className={styles.podiumCard}
                  style={{
                    height: height,
                    borderTop: `5px solid ${borderColor}`,
                  }}
                >
                  <div
                    className={styles.podiumRank}
                    style={{ background: borderColor }}
                  >
                    #{rank}
                  </div>

                  <img
                    src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                      film.poster_path
                    }`}
                    alt={film.title}
                    style={{ width: "100%", borderRadius: 8, marginTop: 15 }}
                  />
                  <h3
                    style={{
                      fontSize: "1rem",
                      marginTop: 15,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {film.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "bold",
                    }}
                  >
                    ★ {film.vote_average.toFixed(1)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
