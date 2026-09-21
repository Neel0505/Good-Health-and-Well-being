import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Disclaimer from '../components/Disclaimer';
import { progressService } from '../services';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const ranges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '3 Months' },
];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
  },
};

const Progress = () => {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await progressService.get({ range });
        setData(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range]);

  if (loading) return <LoadingSpinner label="Loading progress..." />;
  if (error) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        title="Unable to load progress"
        message={error}
      />
    );
  }

  if (!data.hasAnyData) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1 className="page-title">Progress</h1>
            <p className="text-muted mb-0">Charts update from your real logged data.</p>
          </div>
        </div>
        <EmptyState
          icon="bi-graph-up"
          title="No progress data yet"
          message="Log meals, workouts, or health habits to see charts here."
        />
      </div>
    );
  }

  const labels = data.series.map((d) => d.label);
  const weightLabels = data.weightSeries.map((d) => d.label);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Progress</h1>
          <p className="text-muted mb-0">Historical trends based only on available data.</p>
        </div>
        <div className="btn-group range-group">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`btn ${range === item.value ? 'btn-brand' : 'btn-outline-brand'}`}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-1">
        <div className="col-md-4">
          <div className="mini-stat">
            <span>Total Calories</span>
            <strong>{data.totals.calories}</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-stat">
            <span>Total Protein</span>
            <strong>{data.totals.protein} g</strong>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-stat">
            <span>Workouts</span>
            <strong>{data.totals.workouts}</strong>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <ChartCard
            title="Weight Progress"
            subtitle="Line chart from logged weight entries"
            empty={data.weightSeries.length === 0}
          >
            <Line
              options={baseOptions}
              data={{
                labels: weightLabels,
                datasets: [
                  {
                    data: data.weightSeries.map((d) => d.weight),
                    borderColor: '#0369A1',
                    backgroundColor: 'rgba(3,105,161,0.12)',
                    fill: true,
                    tension: 0.35,
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Calorie Intake"
            subtitle="Daily calories from food logs"
            empty={data.series.every((d) => d.calories === 0)}
          >
            <Line
              options={baseOptions}
              data={{
                labels,
                datasets: [
                  {
                    data: data.series.map((d) => d.calories),
                    borderColor: '#0F766E',
                    backgroundColor: 'rgba(15,118,110,0.12)',
                    fill: true,
                    tension: 0.35,
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Protein Intake"
            subtitle="Daily protein totals"
            empty={data.series.every((d) => d.protein === 0)}
          >
            <Bar
              options={baseOptions}
              data={{
                labels,
                datasets: [
                  {
                    data: data.series.map((d) => d.protein),
                    backgroundColor: '#D97706',
                    borderRadius: 8,
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
        <div className="col-lg-6">
          <ChartCard
            title="Workout Frequency"
            subtitle="Completed sessions per day"
            empty={data.series.every((d) => d.workouts === 0)}
          >
            <Bar
              options={baseOptions}
              data={{
                labels,
                datasets: [
                  {
                    data: data.series.map((d) => d.workouts),
                    backgroundColor: '#334155',
                    borderRadius: 8,
                  },
                ],
              }}
            />
          </ChartCard>
        </div>
      </div>

      <Disclaimer compact />
    </div>
  );
};

export default Progress;
