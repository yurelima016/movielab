import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function Category() {
  const { id } = useParams();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function loadFilms() {
      setLoading(true);
      try {
        const response = await api.get("discover/movie", {
          params: {
            api_key: import.meta.env.VITE_API_KEY,
            language: "pt-BR",
            page: 1,
            with_genres: id,
          },
        });

        setFilms(response.data.results);
        setLoading(false);
      } catch (error) {
        console.log("ERRO AO BUSCAR FILMES POR CATEGORIA", error);
        setLoading(false);
      }
    }
    loadFilms();
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
      <h1>Filmes da Categoria ID: {id}</h1>

      <Link to="/categorias">Voltar para Categorias</Link>
      <br />
      <br />

      <ul>
        {films.map((filme) => (
          <li key={filme.id} style={{ marginBottom: 20 }}>
            <strong>{filme.title}</strong>
            <br />
            <Link to={`/filme/${filme.id}`}>Ver Detalhes</Link>
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
