import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Title, Tooltip, Legend);
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-34.9&longitude=-56.19" +
  "&daily=temperature_2m_max,temperature_2m_min&timezone=auto";

const colores = [
  "rgba(235, 99, 54, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
  "rgba(201, 203, 207, 0.7)",
];

export default function EstadisticasTorta() {
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
      legend: { position: "right" },
      title: {
        display: true,
        text: "Temperatura máxima por día (Montevideo)",
      },
    },
  };

  const datos = {
    labels: clima.time,
    datasets: [
      {
        data: clima.temperature_2m_max,
        backgroundColor: colores,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <Pie options={opciones} data={datos} />
    </div>
  );
}
