/// <reference types ="Cypress" />

describe('All Put Requests', ()=>{

    it('Update', ()=>{
        cy.request({

            method: 'PUT',
            url: 'https://reqres.in/api/users/2',
            body: {
                "name": "morpheus",
                "job": "zion resident"
            }

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.name).to.eq('morpheus')
            expect(res.body.job).to.eq('zion resident')
        })
    })
})