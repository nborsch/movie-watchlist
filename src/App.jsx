import { useState, useEffect } from 'react'
import Movie from './Movie'
import Header from './Header'
import './App.css'

function App() {
  const [moviesBasics, setmoviesBasics] = useState([])
  const [moviesData, setMoviesData] = useState([])
  const [watchlist, setWatchlist] = useState(new Map())
  const [isSearch, setIsSearch] = useState(true)
  const [noResults, setNoResults] = useState(false)

  const onFailedConnection = err => {
    return alert(`Connection failure ${err}. Please try again later.`)
  }

  const searchMovies = async formData => {
    setMoviesData([])
    const searchQuery = formData.get("search-query")

    // if searchQuery is an empty string
    if (!searchQuery) return setNoResults(true)

    try {
      const response = await fetch(`api?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${searchQuery}`)
      const data = await response.json()
    
      // if there's no results
      if (!data.Response) return

      setmoviesBasics(data.Search)
      setIsSearch(true)

    } catch(err) {
      onFailedConnection(err)
    }
  }
  // fetch movies data using fetched ids
  useEffect(()=>{

      async function getMovies() {
        const moviesPromises = moviesBasics.map(async movie => {
          const response = await fetch(`api?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${movie.imdbID}`)
          const data = await response.json()
          return data
        })

        try {
          const moviesData = await Promise.all(moviesPromises) 
          
          moviesData.map(movieData => {
            setMoviesData(prev => {
              return [
                ...prev,
                {
                  ...movieData,
                  isInWatchlist: false
                }
              ]
            })
          })
        } catch(err){
          onFailedConnection(err)
        }
        
      }

    if (moviesBasics) {
      getMovies()

    } else {
      setNoResults(true)
    }
  }, [moviesBasics])

  const toggleWatchlist = id => {
    setMoviesData(prevMoviesData => {
      return prevMoviesData.map(movie => {
        if (movie.imdbID === id) {
          if (movie.isInWatchlist){
            setWatchlist(prevWatchlist => {
              prevWatchlist.delete(movie.imdbID)
              return prevWatchlist
            })
          } else {
            setWatchlist(prevWatchlist => {
              prevWatchlist.set(movie.imdbID, movie)
              return prevWatchlist
            })
          }

          return {
            ...movie,
            isInWatchlist: !movie.isInWatchlist
          }
        } else {
          return movie
        }
      })
    })
  }

  const generateMovieEls = (movie) => {
    return (
      <Movie 
        key={movie.imdbID}
        id={movie.imdbID}
        onClick={toggleWatchlist}
        title={movie.Title}
        rating={movie.Ratings.length ? movie.Ratings[0].Value.split('/')[0] : ''}
        duration={movie.Runtime}
        genres={movie.Genre}
        description={movie.Plot}
        cover={movie.Poster}
        isInWatchlist={watchlist.has(movie.imdbID)}
      />
    )
  }

  const moviesEls = moviesData.map(movie => {
    return generateMovieEls(movie)
  })

  const watchlistEls = () => {
    const elements = []
    watchlist.forEach((movie) => {
      elements.push( generateMovieEls(movie) )
    })
    return elements
  }

  const togglePage = () => setIsSearch(prev => !prev)

  const mainClasses = () => {
    if (isSearch && !moviesEls.length && !noResults) return 'search-movies'
    if (!isSearch && watchlist.size === 0) return 'empty-watchlist'
    if (isSearch && noResults) return 'no-results'
  }

  return (
    <>
      <Header 
        isSearch={isSearch}
        togglePage={togglePage}
        searchMovies={searchMovies}
      />
      <main className={mainClasses()}>
        {isSearch ? moviesEls : watchlistEls() }
      </main>
      <footer>
        Copyright © {new Date().getFullYear()} Coded by Nadia Borsch
      </footer>
    </>
  )
}

export default App
