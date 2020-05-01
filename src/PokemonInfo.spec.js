import './styles.css'
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { PokemonInfo, AppErrorBoundary } from './App'

describe('PokemonInfo', () => {
  it('works without error boundary', () => {
    const StylesPokemonInfo = () => (
      <div className="pokemon-info-app">
        <div className="pokemon-info">
          <PokemonInfo pokemonName="pikachu" />
        </div>
      </div>
    )
    mount(<StylesPokemonInfo />)
    cy.contains('h2', 'Pikachu').contains('sup', '25').should('be.visible')
    cy.get('.pokemon-info__fetch-time').should('not.contain', 'loading...')
  })

  it.skip('throws an error on unknown', () => {
    const StylesPokemonInfo = () => (
      <div className="pokemon-info">
        <PokemonInfo pokemonName="unknown" />
      </div>
    )
    mount(<StylesPokemonInfo />)
    // hope that loading element goes away and the name becomes visible
    // of course this does not happen because an error is thrown
    cy.get('.pokemon-info__fetch-time')
      .should('not.contain', 'loading...')
    .and('match', /^\d/)
    cy.get('h2').should('be.visible')
  })

  it('handles error with custom error boundary', () => {
    const pokemonName = 'unknown'
    const onReset = cy.stub().as('reset')
    const ProtectedPokemon = () => (
      <div className="pokemon-info-app">
        <div className="pokemon-info">
          <AppErrorBoundary onReset={onReset} keys={[pokemonName]}>
            <PokemonInfo pokemonName={pokemonName} />
          </AppErrorBoundary>
        </div>
      </div>
    )
    mount(<ProtectedPokemon />)
    // it catches the error
    cy.wait(3000)
    // cy.contains('There was an error:')
    // and allows us to retry
    // cy.contains('button', 'Try again').click()
    // cy.get('@reset')
  })
})
