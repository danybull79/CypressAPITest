/// <reference types ="Cypress" />

describe('All Post Requests', ()=>{

    it('Create', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://reqres.in/api/users',
            body: {
                "name": "morpheus",
                "job": "leader"
            }

        }).then((res)=>{
            expect(res.status).to.eq(201)
            expect(res.body.name).to.eq('morpheus')
            expect(res.body.job).to.eq('leader')
        })
    })

    it('Register Successful', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://reqres.in/api/register',
            body: {
                "email": "eve.holt@reqres.in",
                "password": "pistol"
            }

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(4)
            expect(res.body.token).to.eq('QpwL5tke4Pnpja7X4')
        })
    })

    it('Register Unsuccessful', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://reqres.in/api/register',
            body: {
                "email": "sydney@fife",
            },
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(400)
            expect(res.body.error).to.eq('Missing password')
        })
    })

    it('Login Successful', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://reqres.in/api/login',
            body: {
                "email": "eve.holt@reqres.in",
                "password": "cityslicka"
            }

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.token).to.eq('QpwL5tke4Pnpja7X4')
        })
    })

    it('Login Unsuccessful', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://reqres.in/api/register',
            body: {
                "email": "peter@klaven",
            },
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(400)
            expect(res.body.error).to.eq('Missing password')
        })
    })
})