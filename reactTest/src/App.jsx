import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import MovieCard from './MovieCard'
import TestState from './test/testState'
import './App.css'

function xyz(){
  return 1;
}

function App() {

  // Code
  const [count, setCount] = useState(0)
  const movies = [
    {
      title: '아바타',
      rating: '별점 5점',
      url: 'https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg',
    },
    {
      title: 'Cast Away',
      rating: '별점 5점',
      url: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Cast_away_poster.jpg',
    },
    {
      title: 'God Farther',
      rating: '별점 5점',
      url: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
    },
    {
      title: 'Parasite',
      rating: '별점 5점',
      url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    },
  ]


  // Design
  // JSX  : XML Elements in JavaScript
  return(
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started!!!!!</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us!!!!!!!</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section className="movie-grid-wrap">
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.title}
              title={movie.title}
              rating={movie.rating}
              url={movie.url}
            />
          ))}
        </div>
      </section>
      

      <div className="ticks"></div>
      <section id="spacer"></section>
      <section style={{ padding: '28px 20px 60px' }}>
        <TestState />
      </section>
    </>
  )
}

export default App
