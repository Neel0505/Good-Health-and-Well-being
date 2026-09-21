import { Link } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';

const features = [
  {
    icon: 'bi-egg-fried',
    title: 'Nutrition & Protein',
    text: 'Search foods, log meals, and track calories and protein against daily targets.',
  },
  {
    icon: 'bi-lightning-charge',
    title: 'Workout Tracking',
    text: 'Browse an exercise library and record strength or cardio sessions with sets, reps, and duration.',
  },
  {
    icon: 'bi-graph-up-arrow',
    title: 'Health Dashboard',
    text: 'See daily summaries for nutrition, workouts, water, sleep, and weight in one place.',
  },
];

const steps = [
  { title: 'Create your profile', text: 'Set age, height, weight, activity level and fitness goal.' },
  { title: 'Log daily habits', text: 'Track meals, workouts, water and sleep as part of your routine.' },
  { title: 'Review progress', text: 'Use charts and dashboards to understand trends over time.' },
];

const Home = () => (
  <>
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Personal Health Tracker</p>
          <h1>Your Health. Your Progress. Your Track.</h1>
          <p className="hero-lead">
            FitTrack helps you monitor nutrition, workouts and daily health habits so you can build
            consistency around better well-being.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-brand btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-brand btn-lg">
              Login
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-panel">
            <div className="hero-metric">
              <span>Calories</span>
              <strong>1,850 / 2,400</strong>
            </div>
            <div className="hero-metric">
              <span>Protein</span>
              <strong>92 / 130 g</strong>
            </div>
            <div className="hero-metric">
              <span>Workout</span>
              <strong>Completed</strong>
            </div>
            <div className="hero-ring">
              <i className="bi bi-activity" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Built around three clear pillars</h2>
          <p>Everything in FitTrack supports nutrition, training, and everyday health awareness.</p>
        </div>
        <div className="row g-4">
          {features.map((feature) => (
            <div className="col-md-4" key={feature.title}>
              <div className="feature-block h-100">
                <div className="feature-icon">
                  <i className={`bi ${feature.icon}`} />
                </div>
                <h3 className="h5">{feature.title}</h3>
                <p className="text-muted mb-0">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section section-muted">
      <div className="container">
        <div className="section-heading">
          <h2>How it works</h2>
          <p>A simple loop you can explain in a viva and use every day.</p>
        </div>
        <div className="row g-4">
          {steps.map((step, index) => (
            <div className="col-md-4" key={step.title}>
              <div className="step-block">
                <span className="step-number">{index + 1}</span>
                <h3 className="h5">{step.title}</h3>
                <p className="text-muted mb-0">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className="section-heading text-start mb-0">
              <h2>Aligned with SDG 3</h2>
              <p className="mb-3">
                FitTrack supports Good Health and Well-Being by making everyday nutrition, movement
                and rest easier to notice and improve over time.
              </p>
              <ul className="check-list">
                <li>Encourage consistent healthy habits</li>
                <li>Promote awareness of food and activity choices</li>
                <li>Help users reflect on sleep, hydration and progress</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="sdg-panel">
              <p className="eyebrow mb-2">United Nations · SDG 3</p>
              <h3 className="h4 mb-2">Good Health and Well-Being</h3>
              <p className="mb-0">
                Small daily decisions around food, exercise and recovery add up. FitTrack is designed
                as an educational companion for that journey — not a medical service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section section-cta">
      <div className="container text-center">
        <h2 className="mb-3">Start tracking with intention</h2>
        <p className="mb-4 text-muted">
          Create an account, set your profile, and begin logging meals and workouts today.
        </p>
        <Link to="/register" className="btn btn-brand btn-lg">
          Create Free Account
        </Link>
        <div className="mt-4">
          <Disclaimer compact />
        </div>
      </div>
    </section>
  </>
);

export default Home;
