import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

function Favorites() {
  const [films, setFilms] = useState([]);
  const { user, signed, loadingAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loadingAuth) return;

    if (!signed) {
      navigate("/login");
      return;
    }

    async function loadFavorites() {
      if (!user?.uid) return;

      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setFilms(data.favorites || []);
      }
    }
    loadFavorites();
  }, [user, signed, loadingAuth, navigate]);

  async function deleteMovie(item) {
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      favorites: arrayRemove(item),
    });

    setFilms(films.filter((film) => film.id !== item.id));
    alert("Filme removido");
  }

  if (loadingAuth) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Carregando seus dados...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Meus Filmes Favoritos</h1>

      {films.length === 0 && <span>Você não possui nenhum filme salvo 😢</span>}

      <ul style={{ listStyle: "none", marginTop: 20 }}>
        {films.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: 20,
              border: "1px solid #333",
              padding: 10,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_IMAGE_URL}/w200/${
                item.poster_path
              }`}
              width={80}
            />

            <div>
              <h3>{item.title}</h3>
              <p>Nota: {item.vote_average}</p>

              <div style={{ marginTop: 10 }}>
                <Link to={`/filme/${item.id}`} style={{ marginRight: 10 }}>
                  Ver Detalhes
                </Link>

                <button onClick={() => deleteMovie(item)}>Excluir</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
