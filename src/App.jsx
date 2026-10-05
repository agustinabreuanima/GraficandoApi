import Estadisticas from "./components/Estadisticas";
import IntentoTorta from "./components/IntentoTorta";
import PokeApi from "./components/PokeApi";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <h1>Pronóstico del Tiempo en Barras</h1>
        <Estadisticas />
      </div>
      <div>
        <h1>Pronóstico del Tiempo en Torta</h1>
        <IntentoTorta />
      </div>
      <div>
        <h1>Pokebúsqueda</h1>
        <PokeApi />
      </div>
    </>
  );
}

export default App;
