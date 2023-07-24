/// <reference types ="Cypress" />

describe('Get API User Test', ()=>{

    let accessToken = '5c5e1204ee49419ad0bd16cad19e22f0e95aa559a510f12d4231cde19afac373'
 
      it('Get Users Test', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://gorest.co.in/public-api/users',
            headers: {
                'Authorization' : "Bearer " +  accessToken
            }
            
        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.meta.pagination.limit).to.eq(10)
        })

      })   

      it('Get Users by ID', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://gorest.co.in/public-api/users/2',
            header: {
                'Authorization' : "Bearer " + accessToken 
            }
            
        }).then((res)=>{
            expect(res.status).to.eq(200)
            еxpect(res.body.data.name).to.eq('Hari Mehrotra III')
        })

      }) 

})