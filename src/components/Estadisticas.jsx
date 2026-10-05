//instalar chart.js y react-chartjs-2
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-34.9&longitude=-56.19" +
  "&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

export default function Estadisticas() {
  const [clima, setClima] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function traerDatos() {
      try {
        const respuesta = await fetch(URL);
        if (!respuesta.ok) throw new Error("Error HTTP " + respuesta.status);
        const json = await respuesta.json();
        setClima(json.daily);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    traerDatos();
  }, []);

  if (cargando) return <p>Cargando datos...</p>;
  if (error) return <p>No se pudieron traer los datos: {error}</p>;

  const opciones = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Pronóstico de Montevideo (próximos 7 días)",
      },
    },
  };

  // Transformacion de la respuesta de la API al formato que espera Chart.js
  const datos = {
    labels: clima.time,
    datasets: [
      {
        label: "Máxima (°C)",
        data: clima.temperature_2m_max,
        backgroundColor: "rgba(235, 99, 54, 0.5)",
        borderColor: "rgba(235, 99, 54, 1)",
        borderWidth: 1,
      },
      {
        label: "Mínima (°C)",
        data: clima.temperature_2m_min,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Bar options={opciones} data={datos} />
    </div>
  );
}
