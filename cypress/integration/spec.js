/// <reference types="cypress" />
describe('app', () => {
  it('catches an error', () => {
    cy.visit('http://localhost:3000')
    cy.get('.pokemonName-input').type('unknown')
    cy.contains('Submit').click()
    // currently fails
    cy.contains('Try again').should('be.visible')
  })
})
