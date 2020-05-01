import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from './pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // this will be handled by an error boundary
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function AppErrorBoundary({keys = [], onReset, children}) {
  const [errorAndComponentStack, setErrorAndComponentStack] = React.useState([
    null,
    null,
  ])
  const [error, componentStack] = errorAndComponentStack
  const handleError = (error, componentStack) =>
    setErrorAndComponentStack([error, componentStack])
  const reset = () => setErrorAndComponentStack([null, null])
  const keysRef = React.useRef(keys)

  React.useEffect(() => {
    if (error) {
      const depsChanged = keysRef.current.some(
        (dep, index) => !Object.is(dep, keys[index]),
      )
      if (depsChanged) {
        setErrorAndComponentStack([null, null])
      }
    }
    keysRef.current = keys
  }, [keys, error])

  return error ? (
    <ErrorFallback
      error={error}
      componentStack={componentStack}
      resetErrorBoundary={() => {
        onReset()
        reset()
      }}
    />
  ) : (
    <ErrorBoundary onError={handleError}>{children}</ErrorBoundary>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleTryAgain() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <AppErrorBoundary onReset={handleTryAgain} keys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </AppErrorBoundary>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
