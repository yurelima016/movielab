import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");

  const [searchTerm, setSearchTerm] = useState(query || "");

  useEffect(() => {
    async function loadFilmes() {
      setLoading(true);
      try {
        let endpoint = "/discover/movie";
        let params = {
          api_key: import.meta.env.VITE_API_KEY,
          language: "pt-BR",
          page: 1,
        };

        if (query) {
          endpoint = "/search/movie";
          params.query = query;
        }

        const response = await api.get(endpoint, { params });
        setFilms(response.data.results);
        setLoading(false);
      } catch (error) {
        console.log("ERRO AO BUSCAR", error);
        setLoading(false);
      }
    }

    loadFilmes();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    navigate(`/filmes?q=${searchTerm}`);
  };

  if (loading) {
    return (
      <div>
        <h2>Carregando catálogo...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>{query ? `Resultados para: ${query}` : "Catálogo Completo"}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Busque um filme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <ul>
        {films.map((filme) => (
          <li key={filme.id}>
            <strong>{filme.title}</strong>
            {filme.release_date && (
              <span> ({filme.release_date.substring(0, 4)})</span>
            )}
            <br />
            <Link to={`/filme/${filme.id}`}>Ver Detalhes</Link>
          </li>
        ))}
      </ul>

      {films.length === 0 && <p>Nenhum filme encontrado.</p>}
    </div>
  );
}

export default Films;
