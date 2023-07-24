import { faker } from '@faker-js/faker';

/// <reference types ='Cypress' />

let token;
let orderId;

const randomName = faker.person.fullName();
const randomEmail = faker.internet.email(); 

describe('Simple Book API', ()=>{

    it('Create Token', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://simple-books-api.glitch.me/api-clients/',
            body: {
                "clientName": randomName,
                "clientEmail": randomEmail
            }

        }).then((res)=>{
            expect(res.status).to.eq(201)
            token = res.body.accessToken;
        })
    })

    it('Get Status', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/Status',

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.status).to.eq('OK')
        })
    })

    it('Get All Books', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/books',

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body).length(6)
            expect(res.body[0].id).to.eq(1)
            expect(res.body[0].name).to.eq('The Russian')
            expect(res.body[0].type).to.eq('fiction')
            expect(res.body[0].available).to.eq(true)
            expect(res.body[1].id).to.eq(2)
            expect(res.body[1].name).to.eq('Just as I Am')
            expect(res.body[1].type).to.eq('non-fiction')
            expect(res.body[1].available).to.eq(false)
            expect(res.body[2].id).to.eq(3)
            expect(res.body[2].name).to.eq('The Vanishing Half')
            expect(res.body[2].type).to.eq('fiction')
            expect(res.body[2].available).to.eq(true)
            expect(res.body[3].id).to.eq(4)
            expect(res.body[3].name).to.eq('The Midnight Library')
            expect(res.body[3].type).to.eq('fiction')
            expect(res.body[3].available).to.eq(true)
            expect(res.body[4].id).to.eq(5)
            expect(res.body[4].name).to.eq('Untamed')
            expect(res.body[4].type).to.eq('non-fiction')
            expect(res.body[4].available).to.eq(true)
            expect(res.body[5].id).to.eq(6)
            expect(res.body[5].name).to.eq('Viscount Who Loved Me')
            expect(res.body[5].type).to.eq('fiction')
            expect(res.body[5].available).to.eq(true)
        })
    })

    it('Get Books by Count Limit', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/books?limit=2',

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body).length(2)
            expect(res.body[0].id).to.eq(1)
            expect(res.body[0].name).to.eq('The Russian')
            expect(res.body[0].type).to.eq('fiction')
            expect(res.body[0].available).to.eq(true)
            expect(res.body[1].id).to.eq(2)
            expect(res.body[1].name).to.eq('Just as I Am')
            expect(res.body[1].type).to.eq('non-fiction')
            expect(res.body[1].available).to.eq(false)
            
        })
    })

    it('Get Books by Type - Non-Fiction', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/books?type=non-fiction',

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body).length(2)
            expect(res.body[0].id).to.eq(2)
            expect(res.body[0].name).to.eq('Just as I Am')
            expect(res.body[0].type).to.eq('non-fiction')
            expect(res.body[0].available).to.eq(false)
            expect(res.body[1].id).to.eq(5)
            expect(res.body[1].name).to.eq('Untamed')
            expect(res.body[1].type).to.eq('non-fiction')
            expect(res.body[1].available).to.eq(true)
            
        })
    })

    it('Get Book by ID', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/books/1',

        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body.id).to.eq(1)
            expect(res.body.name).to.eq('The Russian')
            expect(res.body.author).to.eq('James Patterson and James O. Born')
            expect(res.body.isbn).to.eq('1780899475')
            expect(res.body.type).to.eq('fiction')
            expect(res.body.price).to.eq(12.98)
            expect(res.body["current-stock"]).to.eq(12)
            expect(res.body.available).to.eq(true)
            
        })
    })

    it('Get All Orders', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://simple-books-api.glitch.me/orders',
            headers: {
                Authorization : `Bearer ${token}`
            }

        }).then((res)=>{
            expect(res.status).to.eq(200)
        })
    })

    it('Submit Order', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://simple-books-api.glitch.me/orders',
            headers: {
                Authorization : `Bearer ${token}`
            },
            body: {
                "bookId": 1,
                "customerName": randomName
            }

        }).then((res)=>{
            expect(res.status).to.eq(201)
            orderId = res.body.orderId
            expect(res.body.created).to.eq(true)
            expect(res.body.orderId).to.eq(orderId)
        })
    })

    it('Submit Order without body', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://simple-books-api.glitch.me/orders',
            headers: {
                Authorization : `Bearer ${token}`
            },
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(400)
            expect(res.body.error).to.eq('Invalid or missing bookId.')
        })
    })

    it('Submit Order without Auth', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://simple-books-api.glitch.me/orders',
            body: {
                "bookId": 4,
                "customerName": "No Auth"
            },
            failOnStatusCode: false

        }).then((res)=>{
            expect(res.status).to.eq(401)
            expect(res.body.error).to.eq('Missing Authorization header.')
        })
    })

    it('Update Order', ()=>{
        cy.request({

            method: 'PATCH',
            url: 'https://simple-books-api.glitch.me/orders/'+orderId,
            headers: {
                Authorization : `Bearer ${token}`
            },
            body: {
                "customerName": "Jane Doe"
            }

        }).then((res)=>{
            expect(res.status).to.eq(204)
        })
    })

    it('Delete Order', ()=>{
        cy.request({

            method: 'DELETE',
            url: 'https://simple-books-api.glitch.me/orders/'+orderId,
            headers: {
                Authorization : `Bearer ${token}`
            }

        }).then((res)=>{
            expect(res.status).to.eq(204)
        })
    })

})  