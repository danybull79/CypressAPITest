/// <reference types ="Cypress" />

describe('All Get Requests', ()=>{

    it('List Users', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/users?page=2'

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.page).to.eq(2)
            expect(res.body.data).length(6)
            expect(res.body.data[0].id).to.eq(7)
            expect(res.body.data[0].email).to.eq('michael.lawson@reqres.in')
            expect(res.body.data[0].first_name).to.eq('Michael')
            expect(res.body.data[0].last_name).to.eq('Lawson')
        })
    })

    it('Single User', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/users/2'

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.data.id).to.eq(2)
            expect(res.body.data.email).to.eq('janet.weaver@reqres.in')
            expect(res.body.data.first_name).to.eq('Janet')
            expect(res.body.data.last_name).to.eq('Weaver')
        })
    })

    it('Single User Not Found', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/users/23',
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(404)
        })
    })

    it('List Resource', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/unknown'

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.data).length(6)
        })
    })

    it('Single Resource', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/unknown/2'

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.data.id).to.eq(2)
            expect(res.body.data.name).to.eq('fuchsia rose')
            expect(res.body.data.year).to.eq(2001)
            expect(res.body.data.color).to.eq('#C74375')
            expect(res.body.data.pantone_value).to.eq('17-2031')
        })
    })

    it('Single Resource Not Found', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://reqres.in/api/unknown/23',
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(404)
        })
    })
})