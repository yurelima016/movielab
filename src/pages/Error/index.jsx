import { Link } from "react-router-dom";

function Erro() {
  return (
    <div>
      <h1>404</h1>
      <h2>Página não encontrada!</h2>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
}
export default Erro;
