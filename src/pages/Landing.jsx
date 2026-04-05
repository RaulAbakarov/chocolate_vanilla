import '../styles/landing.css'

function Landing() {
  const drops = Array.from({ length: 92 }, (_, index) => {
    const seed = (step) => {
      const value = Math.sin((index + 1) * 97.13 + step * 23.19) * 10000
      return value - Math.floor(value)
    }

    return {
      x: `${seed(1) * 100}%`,
      delay: `${-seed(2) * 3.8}s`,
      speed: `${0.78 + seed(3) * 1.2}s`,
      length: `${16 + seed(4) * 42}px`,
      width: `${0.9 + seed(5) * 1.5}px`,
      drift: `${9 + seed(6) * 25}px`,
      alpha: `${0.18 + seed(7) * 0.6}`,
      blur: `${seed(8) * 0.9}px`,
      depthClass: index % 3 === 0 ? 'drop-far' : index % 3 === 1 ? 'drop-mid' : 'drop-near',
    }
  })

  return (
    <main className="landing" aria-label="Umbrella Landing Page">
      <div className="mist-layer" aria-hidden="true"></div>
      <div className="rain-field" aria-hidden="true">
        {drops.map((drop, index) => (
          <span
            key={index}
            className={`drop ${drop.depthClass}`}
            style={{
              '--x': drop.x,
              '--delay': drop.delay,
              '--speed': drop.speed,
              '--length': drop.length,
              '--width': drop.width,
              '--drift': drop.drift,
              '--alpha': drop.alpha,
              '--blur': drop.blur,
            }}
          ></span>
        ))}
      </div>
      <section className="hero-card">
        <h1>Can i stand under your umbrella?</h1>

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
      </section>
    </main>
  )
}

export default Landing
