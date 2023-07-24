/// <reference types ="Cypress" />

const dataJson = require('../../fixtures/createuser.json')

describe('Post API User Test', () => {

    let accessToken = '5c5e1204ee49419ad0bd16cad19e22f0e95aa559a510f12d4231cde19afac373'
    let randomText = ""
    let testEmail = "" 

    it('Create User Test', () => {

        var pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        for (var i = 0; i < 10; i++)
        randomText+=pattern.charAt(Math.floor(Math.random() * pattern.length));
        testEmail = randomText + '@gmail'

        cy.fixture('createuser').then((payload) =>{
        //1. create user (POST)
        cy.request({
            method: 'POST',
            url: 'https://gorest.co.in/public/v1/users',   //https://gorest.co.in/public-api/users',
            headers:{
                'Authorization' : "Bearer " +  accessToken
            },
            body:{
                "name": payload.name,
                "email": testEmail,
                "gender": payload.gender,
                "status": payload.status
            }

        }).then((res)=>{
            debugger
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(201)
            expect(res.data).has.data.id
            expect(res.body.data).has.property('email', testEmail)
            expect(res.body.data).has.property('name', payload.name)
            expect(res.body.data).has.property('gender', payload.gender)
            expect(res.body.data).has.property('status', payload.status)
        }).then((res) => {
            const userId = res.body.data.id
            cy.log("user id is: " +  userId)
            //2. get user (GET)
            cy.request({
                method: 'GET',
                url: 'https://gorest.co.in/public/v1/users/',//+ userId,     //https://gorest.co.in/public-api/users',
                headers:{
                    'Authorization' : "Bearer " +  accessToken
                }

            }).then((res)=>{
                expect(res.status).to.eq(200)
                expect(res.body.data).has.property('id', userId)
                expect(res.body.data).has.property('name', payload.name)
                expect(res.body.data).has.property('gender', payload.gender)
                expect(res.body.data).has.property('status', payload.status)
                expect(res.body.data).has.property('email', testEmail)
            })
        })
    })

})    

})