import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function Category() {
  const { id } = useParams();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [filmsResponse, genresResponse] = await Promise.all([
          api.get("discover/movie", {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
              page: 1,
              with_genres: id,
            },
          }),
          api.get("genre/movie/list", {
            params: {
              api_key: import.meta.env.VITE_API_KEY,
              language: "pt-BR",
            },
          }),
        ]);

        setFilms(filmsResponse.data.results);
        const genresList = genresResponse.data.genres;
        const genreFound = genresList.find((g) => g.id.toString() === id);

        if (genreFound) {
          setCategoryName(genreFound.name);
        }

        setLoading(false);
      } catch (error) {
        console.log("ERRO AO CARREGAR CATEGORIA", error);
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Carregando filmes...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>
        {categoryName ? `Filmes de ${categoryName}` : `Categoria ID: ${id}`}
      </h1>

      <Link to="/categorias">Voltar para Categorias</Link>
      <br />
      <br />

      <ul>
        {films.map((film) => (
          <li key={film.id} style={{ marginBottom: 20 }}>
            <strong>{film.title}</strong>
            <br />
            <Link to={`/filme/${film.id}`}>Ver Detalhes</Link>
          </li>
        ))}
      </ul>

      {films.length === 0 && (
        <p>Nenhum filme encontrado para esta categoria.</p>
      )}
    </div>
  );
}

export default Category;
