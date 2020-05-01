/// <reference types="cypress" />
describe('app', () => {
  // but then fails the test
  it('catches an error', () => {
    cy.visit('http://localhost:3000')
    cy.get('.pokemonName-input').type('unknown')
    cy.contains('Submit').click()
    // currently fails
    cy.contains('Try again').should('be.visible')
  })

  it('catches an error and all is good', () => {
    cy.visit('http://localhost:3000')
    cy.get('.pokemonName-input').type('unknown')
    cy.contains('Submit').click()
    // you can click "Try again manually"
  })
})
