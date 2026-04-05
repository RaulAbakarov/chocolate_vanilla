import '../styles/landing.css'

function Landing() {
  const drops = Array.from({ length: 18 })

  return (
    <main className="landing" aria-label="Umbrella Landing Page">
      <div className="mist-layer" aria-hidden="true"></div>
      <div className="rain-field" aria-hidden="true">
        {drops.map((_, index) => (
          <span
            key={index}
            className="drop"
            style={{
              left: `${(index + 1) * 5.2}%`,
              animationDelay: `${(index % 9) * 0.24}s`,
              animationDuration: `${1.45 + (index % 5) * 0.28}s`,
            }}
          ></span>
        ))}
      </div>
      <section className="hero-card">
        <p className="label">Now Playing Mood</p>
        <h1>Can i stand under your umbrella?</h1>
        <p className="subtext">A small corner for rainy-day energy in deep green tones.</p>

        <div className="spotify-wrap">
          <iframe
            title="Umbrella by Rihanna"
            src="https://open.spotify.com/embed/track/49FYlytm3dAAraYgpoJZux?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>

        <a
          className="spotify-link"
          href="https://open.spotify.com/track/49FYlytm3dAAraYgpoJZux?si=lnOUw9WlTeWfX80p7rXZIQ"
          target="_blank"
          rel="noreferrer"
        >
          Open on Spotify
        </a>
      </section>
      <div className="rain-line" aria-hidden="true"></div>
    </main>
  )
}

export default Landing
