# Custom error boundary example

Downloaded from [codesandbox](https://codesandbox.io/s/throbbing-thunder-67cnp) from [tweet](https://twitter.com/kentcdodds/status/1255981305218469888)

```shell
npm i -D cypress cypress-react-unit-test
```

Set [cypress/plugins/index.js](cypress/plugins/index.js), [cypress/support/index.js](cypress/support/index.js) and [cypress.json](cypress.json) files following [cypress-react-unit-test README](https://github.com/bahmutov/cypress-react-unit-test).

Tests in [src/PokemonInfo.spec.js](src/PokemonInfo.spec.js)

![All good](images/info.gif)

Trying to fetch unknown pokemon leads to a broken test

![Uncaught error](images/uncaught-error.png)

## Observations

- Initially `react-scripts@3.4.1` did not include webpack?! Had to drop-down to `react-scripts@3.3.1`
- `index.js` included `ReactDOM.render(<App />, document.getElementById('root'))` which just generated a cryptic error
- if the user forgets to include `cypress-react-unit-test/support` from the support file, the error is cryptic
- custom error boundary works

![Custom error boundary](images/custom-boundary.png)

BUT

We can click the "try again" button ourselves and it triggers the stub, but if we try to wait or do any command from the test, it fails the test

```js
const pokemonName = 'unknown'
const onReset = cy.stub().as('reset')
const ProtectedPokemon = () => (
  <div className="pokemon-info">
    <AppErrorBoundary onReset={onReset} keys={[pokemonName]}>
      <PokemonInfo pokemonName={pokemonName} />
    </AppErrorBoundary>
  </div>
)
mount(<ProtectedPokemon />)
// it catches the error
cy.wait(3000)
```

![Try to wait and the test fails](images/try-wait.png)

