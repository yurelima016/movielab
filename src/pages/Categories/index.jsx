import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Categorias() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGenres() {
      try {
        const response = await api.get("/genre/movie/list", {
          params: {
            api_key: import.meta.env.VITE_API_KEY,
            language: "pt-BR",
          },
        });

        setGenres(response.data.genres);
        setLoading(false);
      } catch (error) {
        console.log("ERRO AO BUSCAR CATEGORIAS", error);
        setLoading(false);
      }
    }

    loadGenres();
  }, []);

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Categorias</h1>

      <ul style={{ listStyle: "none" }}>
        {genres.map((genero) => {
          return (
            <li key={genero.id} style={{ marginBottom: "10px" }}>
              <Link
                to={`/categoria/${genero.id}`}
                style={{
                  color: "#BD8C34",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                {genero.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Categorias;
