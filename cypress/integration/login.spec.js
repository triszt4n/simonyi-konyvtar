describe("Login flow", () => {
  it("sets auth cookie when logging in via form submission", () => {
    // destructuring assignment of the this.currentUser object
    const user = {
      email: "john@doe.com",
      password: "asdfghjkl",
    }

    cy.visit("/login")

    cy.get("input[name=email]").type(user.email)

    // {enter} causes the form to submit
    cy.get("input[name=password]").type(`${user.password}{enter}`)

    // we should be redirected to /dashboard
    cy.url().should("include", "/")

    // our auth cookie should be present
    cy.getCookie("sess").should("exist")
  })
})
