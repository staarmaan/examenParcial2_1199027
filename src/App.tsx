import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import homeImage from './assets/home.png'
import aboutImage from './assets/about.png'
import Formulario from './components/formulario'
import GameEmbed from "./components/GameEmbed"

type Page = 'home' | 'about'

function App() {
  const [activePage, setActivePage] = useState<Page>('home')

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="nav-brand">
          <img className="nav-logo" src={logo} />
        </div>
        <nav className="nav-links" aria-label="Principal">
          <button
            type="button"
            className={`nav-button ${
              activePage === 'home' ? 'active' : ''
            }`}
            onClick={() => setActivePage('home')}
            aria-current={activePage === 'home' ? 'page' : undefined}
            aria-label="Home"
          >
            <img className="nav-icon" src={homeImage} alt="Home" />
          </button>
          <button
            type="button"
            className={`nav-button ${
              activePage === 'about' ? 'active' : ''
            }`}
            onClick={() => setActivePage('about')}
            aria-current={activePage === 'about' ? 'page' : undefined}
            aria-label="About"
          >
            <img className="nav-icon" src={aboutImage} alt="About" />
          </button>
        </nav>
      </header>
      <main className="page">
        {activePage === 'home' ? (
          <>
            <header className="page-header">
              <h1>Generador de CV</h1>
              <p>Completa tus datos y descarga un CV en PDF.</p>
            </header>
            <Formulario />
          </>
        ) : (
          <section aria-label="About">
            <p>
              <a
                href="https://rabanoide.itch.io/pengunners"
                target="_blank"
                rel="noreferrer"
              >
                hola profesor, cheque mi jueguito porfis (y con alguien mas por
                que es multijugador local)
              </a>
            </p>
            <div style={{ marginTop: 24 }}>
              <p>CONTROLES TECLADO</p>
              <p>flechitas para moverse y apuntar</p>
              <p>Z o Espacio para saltar</p>
              <p>X y C para disparar</p>
              <p>Shift para hacer burla</p>
            </div>
            <div style={{ marginTop: 24 }}>
              <p>CONTROLES CONTROL</p>
              <p>Dpad o Joystick izquierdo para moverse y apuntar</p>
              <p>A y B para saltar</p>
              <p>X e Y para disparar</p>
              <p>Gatillos para hacer burla</p>
            </div>
            <div style={{ marginTop: 24 }}>
              <GameEmbed/>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
