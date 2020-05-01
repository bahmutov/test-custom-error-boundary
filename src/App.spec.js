import './styles.css'
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { App } from '.'

describe('App', () => {
  it('works', () => {
    mount(<App />)
    cy.get('.pokemonName-input').type('mew')

    cy.spy(window, 'fetch').as('fetch')
    cy.contains('Submit').click()

    // easy to spy on GraphQL calls
    // or even stub them, see https://github.com/bahmutov/test-apollo
    cy.get('@fetch').should('have.been.calledOnce').its('firstCall.args').should(([url, params]) => {
      expect(url, 'destination url').to.equal('https://graphql-pokemon.now.sh')
      expect(params.method, 'method').to.equal('POST')
      const body = JSON.parse(params.body)
      expect(body.variables).to.deep.equal({
        name: 'mew'
      })
    })

    cy.contains('h2', 'Mew').contains('sup', '151').should('be.visible')
    cy.get('.pokemon-info__fetch-time').should('not.contain', 'loading...')
  })
})
