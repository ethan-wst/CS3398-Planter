import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const PlantProgress = ({ plant }) => {
    const wateringHistory = plant?.wateringHistory || [];
    const sunlightLog = plant?.sunlightLog || [];

    const wateringData = {
        labels : wateringHistory.map(entry => entry.date),
        datasets: [
            {
                label: 'Watering Progress',
                data: wateringHistory.map(entry => entry.amount),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.2,
            },
        ],
    };

    const sunlightData = {
        labels : sunlightLog.map(entry => entry.date),
        datasets: [
            {
                label: 'Sunlight Exposure',
                data: [5, 6, 7, 8],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.2,
            },
        ],
    };

    return (
        <div className="p-4 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Watering History</h2>
            <Line data={wateringData} />
          </div>
    
          <div>
            <h2 className="text-xl font-semibold mb-2">Sunlight History</h2>
            <Bar data={sunlightData} />
          </div>
        </div>
      );
    };
    
export default PlantProgress;



