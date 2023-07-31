import { faker } from '@faker-js/faker';

/// <reference types ='Cypress' />

let token;
let bookingId;

const randomFirstName = faker.person.firstName();
const randomLastName = faker.person.lastName();
const randomEmail = faker.internet.email(); 
const randomData = faker.defaultRefDate();
const randomDataStartOfDay = new Date(randomData);
randomDataStartOfDay.setHours(0, 0, 0, 0);
const randomPrice = Number(faker.commerce.price());
//const randomPrice = faker.commerce.price();

describe('Booker API Tests', ()=>{

    it('Create Token', ()=>{
        cy.request({

            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                "username" : "admin",
                "password" : "password123"
            }
        }).then((res)=>{
            expect(res.status).to.eq(200)
            token = res.body.token
        })
    })

    it('Booking IDs', ()=>{
        cy.request({

            method: 'GET',
            url: 'https://restful-booker.herokuapp.com/booking',
            
        }).then((res)=>{
            expect(res.status).to.eq(200)
            expect(res.body).to.be.an('array')

            for (let i = 0; i < res.body.length; i++) {
                expect(res.body[i].bookingid).to.exist;
            }
        })
    })

    it('Create Booking Depositpaid True', ()=>{

        cy.request({

            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: {
                "firstname" : randomFirstName,
                "lastname" : randomLastName,
                "totalprice" : randomPrice,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : randomData,
                    "checkout" : randomData
                },
                "additionalneeds" : "Breakfast"
            }
        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            bookingId = res.body.bookingid
            expect(res.body.bookingid).to.be.a('number')
            expect(res.body.booking.firstname).to.eq(randomFirstName)
            expect(res.body.booking.firstname).to.be.a('string')
            expect(res.body.booking.lastname).to.eq(randomLastName)
            expect(res.body.booking.lastname).to.be.a('string')
            expect(parseFloat(res.body.booking.totalprice)).to.equal(parseFloat(randomPrice.toFixed(2)))
            expect(res.body.booking.totalprice).to.be.a('number')
            expect(res.body.booking.depositpaid).to.eq(true)
            expect(new Date(res.body.booking.bookingdates.checkin).toDateString()).to.equal(randomDataStartOfDay.toDateString());
            expect(res.body.booking.bookingdates.checkin).to.be.a('string')
            expect(new Date(res.body.booking.bookingdates.checkout).toDateString()).to.equal(randomDataStartOfDay.toDateString());
            expect(res.body.booking.bookingdates.checkout).to.be.a('string')
        })
    })

    it('Create Booking Depositpaid False', ()=>{

        cy.request({

            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            body: {
                "firstname" : randomFirstName,
                "lastname" : randomLastName,
                "totalprice" : randomPrice,
                "depositpaid" : false,
                "bookingdates" : {
                    "checkin" : randomData,
                    "checkout" : randomData
                },
                "additionalneeds" : "Breakfast"
            }
        }).then((res)=>{
            cy.log(JSON.stringify(res))
            bookingId = res.body.bookingid
            expect(res.status).to.eq(200)
            expect(res.body.bookingid).to.be.a('number')
            expect(res.body.booking.firstname).to.eq(randomFirstName)
            expect(res.body.booking.firstname).to.be.a('string')
            expect(res.body.booking.lastname).to.eq(randomLastName)
            expect(res.body.booking.lastname).to.be.a('string')
            expect(parseFloat(res.body.booking.totalprice)).to.equal(parseFloat(randomPrice.toFixed(2)))
            expect(res.body.booking.totalprice).to.be.a('number')
            expect(res.body.booking.depositpaid).to.eq(false)
            expect(new Date(res.body.booking.bookingdates.checkin).toDateString()).to.equal(randomDataStartOfDay.toDateString())
            expect(res.body.booking.bookingdates.checkin).to.be.a('string')
            expect(new Date(res.body.booking.bookingdates.checkout).toDateString()).to.equal(randomDataStartOfDay.toDateString())
            expect(res.body.booking.bookingdates.checkout).to.be.a('string')
        })
    })

    it('Get Booking by ID', ()=>{

        cy.request({

            method: 'GET',
            url: 'https://restful-booker.herokuapp.com/booking/'+bookingId

        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body.firstname).to.be.a('string')
            expect(res.body.firstname).not.to.be.empty
            expect(res.body.lastname).to.be.a('string')
            expect(res.body.lastname).not.to.be.empty
            expect(res.body.totalprice).to.be.a('number')
            expect(res.body.totalprice).not.to.be.null
            expect(res.body.totalprice).not.to.be.undefined
            expect(res.body.depositpaid).to.eq(false)
            expect(new Date(res.body.bookingdates.checkin).toDateString()).to.equal(randomDataStartOfDay.toDateString())
            expect(new Date(res.body.bookingdates.checkout).toDateString()).to.equal(randomDataStartOfDay.toDateString())
        })
    })

    it('Update Booking', ()=>{
        const admin = 'admin';
        const password123 = 'password123';

        cy.request({

            method: 'PUT',
            url: 'https://restful-booker.herokuapp.com/booking/'+bookingId,
            headers: {
                Authorization: `Basic ${btoa(admin + ':' + password123)}`                    
            },
            body: {
                "firstname" : "James",
                "lastname" : "Brown",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : randomData,
                    "checkout" : randomData
                },
                "additionalneeds" : "Breakfast"
            }
        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body.firstname).to.eq('James')
            expect(res.body.firstname).to.be.a('string')
            expect(res.body.lastname).to.eq('Brown')
            expect(res.body.lastname).to.be.a('string')
            expect(res.body.totalprice).to.eq(111)
            expect(res.body.depositpaid).to.eq(true)
            expect(new Date(res.body.bookingdates.checkin).toDateString()).to.equal(randomDataStartOfDay.toDateString())
            expect(res.body.bookingdates.checkin).to.be.a('string')
            expect(new Date(res.body.bookingdates.checkout).toDateString()).to.equal(randomDataStartOfDay.toDateString())
            expect(res.body.bookingdates.checkout).to.be.a('string')
        })
    })

    it('Update Booking Without Auth', ()=>{
       
        cy.request({

            method: 'PUT',
            url: 'https://restful-booker.herokuapp.com/booking/'+bookingId,
            body: {
                "firstname" : "James",
                "lastname" : "Brown",
                "totalprice" : 111,
                "depositpaid" : true,
                "bookingdates" : {
                    "checkin" : randomData,
                    "checkout" : randomData
                },
                "additionalneeds" : "Breakfast"
            },
            failOnStatusCode: false

        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(403)
        })
    })

    it('Update Booking', ()=>{
        const admin = 'admin';
        const password123 = 'password123';

        cy.request({

            method: 'PATCH',
            url: 'https://restful-booker.herokuapp.com/booking/'+bookingId,
            headers: {
                Authorization: `Basic ${btoa(admin + ':' + password123)}`                    
            },
            body: {
                "firstname" : "James",
                "lastname" : "Brown",
            }
        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body.firstname).to.eq('James')
            expect(res.body.firstname).to.be.a('string')
            expect(res.body.lastname).to.eq('Brown')
            expect(res.body.lastname).to.be.a('string')
        })
    })

    it('Update Booking', ()=>{
        const admin = 'admin';
        const password123 = 'password123';

        cy.request({

            method: 'DELETE',
            url: 'https://restful-booker.herokuapp.com/booking/'+bookingId,
            headers: {
                Authorization: `Basic ${btoa(admin + ':' + password123)}`                    
            },

        }).then((res)=>{
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(201)
        })
    })

})