import Disclaimer from '../components/Disclaimer';

const About = () => (
  <section className="section about-page">
    <div className="container narrow-container">
      <p className="eyebrow">About FitTrack</p>
      <h1 className="mb-3">A clearer way to track everyday well-being</h1>
      <p className="lead text-muted">
        FitTrack is a MERN-stack web application built as a college Web Programming Laboratory
        project. It helps users monitor nutrition, workouts and daily health habits in one place.
      </p>

      <div className="about-block">
        <h2 className="h4">What FitTrack is</h2>
        <p>
          FitTrack is a personal health, nutrition and fitness tracker. Users can create a profile,
          estimate daily calorie and protein targets, search a food database, log meals, record
          workouts, and review progress through dashboards and charts.
        </p>
      </div>

      <div className="about-block">
        <h2 className="h4">Why health tracking matters</h2>
        <p>
          Awareness is often the first step toward better habits. Logging meals, training sessions,
          water intake, sleep and weight can help people notice patterns, stay consistent, and make
          more intentional choices. FitTrack focuses on practical tracking — not medical diagnosis.
        </p>
      </div>

      <div className="about-block">
        <h2 className="h4">Project objective</h2>
        <p>
          The goal is to demonstrate a complete, connected MERN application with authentication,
          CRUD operations, validation, responsive UI, and real MongoDB persistence — centered on
          three pillars: nutrition, workouts, and health progress.
        </p>
      </div>

      <div className="about-block">
        <h2 className="h4">Connection to SDG 3</h2>
        <p>
          SDG 3 promotes Good Health and Well-Being. FitTrack supports that theme by encouraging
          users to pay attention to nutrition balance, physical activity and restorative habits such
          as sleep and hydration. It is an educational tool for personal awareness and learning.
        </p>
      </div>

      <Disclaimer />
    </div>
  </section>
);

export default About;
