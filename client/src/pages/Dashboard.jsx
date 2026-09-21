import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import StatCard, { ProgressCard } from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Disclaimer from '../components/Disclaimer';
import { dashboardService } from '../services';
import { formatDate } from '../utils/helpers';

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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(15, 23, 42, 0.06)' } },
  },
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await dashboardService.get();
        setData(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) {
    return (
      <EmptyState
        icon="bi-exclamation-triangle"
        title="Could not load dashboard"
        message={error}
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  const { summary, targets, weekly, todayWorkouts, waterTarget } = data;
  const labels = weekly.map((d) => d.label);

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {data.greeting}, {data.userName.split(' ')[0]}
          </h1>
          <p className="text-muted mb-0">{formatDate(data.date)}</p>
        </div>
        <Link to="/app/nutrition" className="btn btn-brand">
          Log Food
        </Link>
      </div>

      {targets.incompleteProfile && (
        <div className="alert alert-warning">
          Complete your profile for personalized calorie and protein targets.{' '}
          <Link to="/app/profile">Update profile</Link>
        </div>
      )}

      <div className="row g-3">
        <div className="col-6 col-xl-4">
          <ProgressCard
            title="Calories"
            current={summary.calories}
            target={targets.calorieTarget}
            unit="kcal"
            icon="bi-fire"
            tone="teal"
          />
        </div>
        <div className="col-6 col-xl-4">
          <ProgressCard
            title="Protein"
            current={summary.protein}
            target={targets.proteinTarget}
            unit="g"
            icon="bi-droplet"
            tone="amber"
          />
        </div>
        <div className="col-6 col-xl-4">
          <ProgressCard
            title="Water"
            current={summary.water}
            target={waterTarget}
            unit="ml"
            icon="bi-cup-straw"
            tone="sky"
          />
        </div>
        <div className="col-6 col-xl-4">
          <StatCard
            icon="bi-moon-stars"
            label="Sleep"
            value={`${summary.sleep || 0} hours`}
            subtext="Logged today"
            tone="slate"
          />
        </div>
        <div className="col-6 col-xl-4">
          <StatCard
            icon="bi-speedometer"
            label="Weight"
            value={summary.weight ? `${summary.weight} kg` : '—'}
            subtext="Latest recorded"
            tone="teal"
          />
        </div>
        <div className="col-6 col-xl-4">
          <StatCard
            icon="bi-lightning-charge"
            label="Workout"
            value={summary.workoutCompleted ? 'Completed' : 'Not Completed'}
            subtext={`${summary.workoutCount} session(s) today`}
            tone="amber"
          />
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <div className="panel h-100">
            <div className="panel-header">
              <h2 className="h6 mb-0">Today&apos;s Nutrition</h2>
              <Link to="/app/nutrition" className="small">
                Manage
              </Link>
            </div>
            <ProgressCard
              title="Calories"
              current={summary.calories}
              target={targets.calorieTarget}
              unit="kcal"
            />
            <div className="mt-3">
              <ProgressCard
                title="Protein"
                current={summary.protein}
                target={targets.proteinTarget}
                unit="g"
                tone="amber"
              />
            </div>
            <p className="small text-muted mt-3 mb-0">
              Carbs {summary.carbs}g · Fat {summary.fat}g
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="panel h-100">
            <div className="panel-header">
              <h2 className="h6 mb-0">Today&apos;s Workout</h2>
              <Link to="/app/workouts" className="small">
                Open
              </Link>
            </div>
            {todayWorkouts.length === 0 ? (
              <EmptyState
                icon="bi-lightning"
                title="No workout logged today"
                message="Start a session from the workout library."
                actionLabel="Start Workout"
                onAction={() => {
                  window.location.href = '/app/workouts';
                }}
              />
            ) : (
              todayWorkouts.map((workout) => (
                <div key={workout._id} className="mb-3">
                  <p className="fw-semibold mb-1">{workout.workoutName}</p>
                  <div className="d-flex flex-wrap gap-1">
                    {workout.exercises.map((ex, idx) => (
                      <span key={idx} className="chip">
                        {ex.exerciseId?.name || 'Exercise'}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="panel h-100">
            <div className="panel-header">
              <h2 className="h6 mb-0">Health Habits</h2>
              <Link to="/app/health" className="small">
                Update
              </Link>
            </div>
            <ul className="habit-list">
              <li>
                <span>Water</span>
                <strong>
                  {summary.water} / {waterTarget} ml
                </strong>
              </li>
              <li>
                <span>Sleep</span>
                <strong>{summary.sleep || 0} hours</strong>
              </li>
              <li>
                <span>Weight</span>
                <strong>{summary.weight ? `${summary.weight} kg` : 'Not logged'}</strong>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="panel">
            <div className="panel-header">
              <h2 className="h6 mb-0">Weekly Overview</h2>
              <Link to="/app/progress" className="small">
                Full progress
              </Link>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <ChartCard title="Calories" empty={weekly.every((d) => d.calories === 0)}>
                  <Bar
                    options={chartOptions}
                    data={{
                      labels,
                      datasets: [
                        {
                          data: weekly.map((d) => d.calories),
                          backgroundColor: '#0F766E',
                          borderRadius: 8,
                        },
                      ],
                    }}
                  />
                </ChartCard>
              </div>
              <div className="col-md-6">
                <ChartCard title="Protein" empty={weekly.every((d) => d.protein === 0)}>
                  <Bar
                    options={chartOptions}
                    data={{
                      labels,
                      datasets: [
                        {
                          data: weekly.map((d) => d.protein),
                          backgroundColor: '#D97706',
                          borderRadius: 8,
                        },
                      ],
                    }}
                  />
                </ChartCard>
              </div>
              <div className="col-md-6">
                <ChartCard
                  title="Weight"
                  empty={weekly.every((d) => d.weight === null)}
                >
                  <Line
                    options={chartOptions}
                    data={{
                      labels,
                      datasets: [
                        {
                          data: weekly.map((d) => d.weight),
                          borderColor: '#0369A1',
                          backgroundColor: 'rgba(3, 105, 161, 0.12)',
                          fill: true,
                          tension: 0.35,
                          spanGaps: true,
                        },
                      ],
                    }}
                  />
                </ChartCard>
              </div>
              <div className="col-md-6">
                <ChartCard title="Workouts" empty={weekly.every((d) => d.workouts === 0)}>
                  <Bar
                    options={chartOptions}
                    data={{
                      labels,
                      datasets: [
                        {
                          data: weekly.map((d) => d.workouts),
                          backgroundColor: '#334155',
                          borderRadius: 8,
                        },
                      ],
                    }}
                  />
                </ChartCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Disclaimer compact />
    </div>
  );
};

export default Dashboard;
