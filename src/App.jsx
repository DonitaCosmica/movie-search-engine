import { useRef, useState, useEffect, useCallback } from 'react'
import { useMovies } from './hooks/useMovies.js'
import { Movies } from './components/Movies.jsx'
import debounce from 'just-debounce-it'
import './App.css'

function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if(isFirstInput.current) {
      isFirstInput.current = search === '';
      return;
    }

    if(search === '') {
      setError('No se puede buscar una película vacía');
      return;
    }

    if(search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con un número');
      return;
    }

    if(search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres');
      return;
    }

    setError(null);
  }, [search])

  return { search, error, updateSearch }
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, error, updateSearch } = useSearch();
  const { movies, getMovies, loading } = useMovies({ search, sort });

  const debounceGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 500)
  , [getMovies])
 
  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
  }

  const handleSort = () => {
    setSort(!sort);
  }

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(event.target.value);
    debounceGetMovies(newSearch) 
  }

  return (
    <div className="page">
      
      <header>
        <h1>Buscador de películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }} onChange={handleChange} value={search} placeholder='Avengers, Star Wars, ...' 
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscador</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading
            ? <p>Cargando...</p>
            : <Movies movies={movies} />
        } 
      </main>
        
    </div>  
  );
}

export default App
