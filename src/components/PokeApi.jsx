//instalar chart.js y react-chartjs-2
import { useEffect, useState } from "react";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

function limpiarNombreStat(nombre) {
  if (nombre === "hp") return "HP";
  return nombre
    .split("-") //split sirve para separar un string en un array de strings, usando el caracter que le pasemos como separador
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function PokeApi() {
  const [texto, setTexto] = useState("pikachu");
  const [nombre, setNombre] = useState("pikachu");
  const [pokemon, setPokemon] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipo, setTipo] = useState("radar");

  useEffect(() => {
    const controlador = new AbortController();

    async function traerDatos() {
      setCargando(true);
      setError(null);
      try {
        const respuesta = await fetch(
          "https://pokeapi.co/api/v2/pokemon/" + nombre,
          { signal: controlador.signal },
        );
        if (respuesta.status === 404) {
          throw new Error('No existe ningún Pokémon llamado "' + nombre + '"');
        }
        if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
        const json = await respuesta.json();
        setPokemon(json);
      } catch (e) {
        if (e.name === "AbortError") return;
        setPokemon(null);
        setError(e.message);
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }
    traerDatos();

    return () => controlador.abort();
  }, [nombre]);

  const buscar = (e) => {
    e.preventDefault();
    const limpio = texto.trim().toLowerCase();
    if (limpio === "") return;
    setNombre(limpio);
  };

  const controles = (
    <div style={{ textAlign: "center", margin: "16px" }}>
      <form onSubmit={buscar} style={{ marginBottom: "12px" }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nombre del Pokémon (ej: charizard)"
        />
        <button type="submit">Buscar</button>
      </form>
      <div>
        <button onClick={() => setTipo("radar")} disabled={tipo === "radar"}>
          Radar
        </button>
        <button onClick={() => setTipo("barras")} disabled={tipo === "barras"}>
          Barras
        </button>
      </div>
    </div>
  );

  let contenido;

  if (cargando) {
    contenido = <p>Cargando datos...</p>;
  } else if (error) {
    contenido = <p>No se pudieron traer los datos: {error}</p>;
  } else {
    const imagen =
      pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.front_default;

    const titulo = "Estadísticas base de " + capitalizar(pokemon.name);

    const datos = {
      labels: pokemon.stats.map((s) => limpiarNombreStat(s.stat.name)),
      datasets: [
        {
          label: "Valor base",
          data: pokemon.stats.map((s) => s.base_stat),
          backgroundColor: "rgba(235, 99, 54, 0.5)",
          borderColor: "rgba(235, 99, 54, 1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    };

    const opcionesComunes = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: titulo },
      },
    };

    const opcionesRadar = {
      ...opcionesComunes,
      scales: { r: { min: 0, max: 255 } },
    };
    const opcionesBarras = {
      ...opcionesComunes,
      scales: { y: { min: 0, max: 255 } },
    };

    contenido = (
      <div style={{ textAlign: "center" }}>
        {imagen && <img src={imagen} alt={pokemon.name} width={200} />}
        <h2>{capitalizar(pokemon.name)}</h2>
        <div style={{ width: "60%", margin: "0 auto" }}>
          {tipo === "radar" ? (
            <Radar options={opcionesRadar} data={datos} />
          ) : (
            <Bar options={opcionesBarras} data={datos} />
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {controles}
      {contenido}
    </>
  );
}
