'use strict'

const pk = 'FLWPUBK_TEST-5b7d692ad1ab32330dd98067d1b5c3da-X'
const sk = 'FLWSECK_TEST-ab205ff42786564ba99c69ec7fd133ef-X' // 
const ek = 'FLWSECK_TEST443a1009c9bf'

let _ = require('underscore')
let fs = require('fs')
let path = require('path')
let request = require('request')

let index = (req, res, next) => {
    res.redirect('/customerValidation')
}

let getCustomerValidation = (req, res, next) => {
    res.render('customerValidationForm', {
        title: 'Customer Validation Form'
    })
}

let dateCompare = (d1, d2) => {
    let date1 = new Date(d1)
    let date2 = new Date(d2)
    return date1.toString() == date2.toString()
}

let postCustomerValidation = (req, res, next) => {
    let { firstName, lastName, dateOfBirth, phone, bvn } = req.body
    let sk = 'FLWSECK-e6db11d1f8a6208de8cb2f94e293450e-X'
    let reqURI = `https://ravesandboxapi.flutterwave.com/v2/kyc/bvn/${bvn}?seckey=${sk}`

    request(reqURI, (err, _res, body) => {
        if (err) {
            console.error(err)
            res.json(err)
        }
        else {
            // console.log(_res, body)
            let mismatches = []
            let bod = JSON.parse(body)
            let rs = bod['data']
            console.log(bod, rs, req.body)
            if (bod.status == 'success') {
                if (rs.phone_number != phone) {
                    mismatches.push('Phone')
                }
                if (rs.first_name != firstName) {
                    mismatches.push('First Name')
                }
                if (rs.last_name != lastName) {
                    mismatches.push('Last Name')
                }
                if (rs.bvn != bvn) {
                    mismatches.push('BVN')
                }
                if (!dateCompare(rs.date_of_birth, dateOfBirth)) {
                    mismatches.push('Date Of Birth')
                }
                res.json({
                    mismatches
                })
            }
            else {
                res.json({
                    error: ''
                })
            }
        }
    })
}

let customerValidationDone = (req, res, next) => {
    res.render('customerValidationDone', {
        title: 'Customer Validation Completed'
    })
}

let pickTwoDifferent = (lst) => {
    const pickup = lst[Math.floor(Math.random() * lst.length)]
    const destination = lst[Math.floor(Math.random() * lst.length)]
    if (pickup == destination) {
        return pickTwoDifferent(lst)
    }
    return { pickup, destination }
}

const names = require('../names.json').Name
const places = ['Ikeja', 'Lekki', 'Banana Island', 'Ikoyi', 'Ojuelegba', 'Festac']

let getRideSharing = (req, res, next) => {
    const driverName = names[Math.floor(Math.random() * names.length)].NigerianName
    const { pickup, destination } = pickTwoDifferent(places)
    const fare = (Math.ceil(Math.random() * 10) * 100) + 700
    const tip = 0
    const currency = 'NGN'

    res.render('rideSharing', {
        needRave: true,
        title: 'Ride Sharing Payment',
        driverName,
        pickup,
        destination,
        currency,
        tip,
        fare
    })
}

let getRideSharingJSON = (req, res, next) => {
    const driverName = names[Math.floor(Math.random() * names.length)].NigerianName
    const { pickup, destination } = pickTwoDifferent(places)
    const fare = (Math.ceil(Math.random() * 10) * 100) + 700
    const tip = 0
    const currency = 'NGN'

    res.json({
        needRave: true,
        title: 'Ride Sharing Payment',
        driverName,
        pickup,
        destination,
        currency,
        tip,
        fare
    })
}

let postRideSharing = (req, res, next) => {}

let rideSharingDone = (req, res, next) => {
    console.log(req.params.detailsJSON)
    let details = JSON.parse(req.params.detailsJSON)
    console.log(details)
    res.render('rideSharingDone', Object.assign({
        needChart: true,
        title: 'Ride Sharing Payment Completed',
    }, details))
}

module.exports = {
    index,

    getCustomerValidation,
    postCustomerValidation,
    customerValidationDone,

    getRideSharing,
    // postRideSharing,
    rideSharingDone,
}
