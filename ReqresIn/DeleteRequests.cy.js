/// <reference types ="Cypress" />

describe('All Delete Requests', ()=>{

    it('Update', ()=>{
        cy.request({

            method: 'DELETE',
            url: 'https://reqres.in/api/users/2'

        }).then((res)=>{
            expect(res.status).to.eq(204)
        })
    })
})