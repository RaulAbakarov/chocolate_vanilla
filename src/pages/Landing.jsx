import '../styles/landing.css'

function Landing() {
  return (
    <div className="landing">
      <div className="grave-container">
        <div className="grave">
          <div className="grave-top"></div>
          <div className="grave-body">
            <div className="cross">✝</div>
            <h1 className="rip">R.I.P</h1>
            <p className="dates">15.01.2026 - 08.02.2026</p>
            <p className="cause">Ölüm səbəbi: Yüksək sürət</p>
          </div>
        </div>
        <div className="grave-ground"></div>
      </div>
      <p className="reincarnation">Reinkarnasiyaya inanırsınmı?</p>
    </div>
  )
}

export default Landing
