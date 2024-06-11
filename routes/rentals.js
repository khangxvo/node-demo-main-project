
const express = require('express')
const router = express.Router()
const { Rental, validate } = require('../models/rentals')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')

router.get('/', async (req, res) => {
    const result = await Rental.find();
    res.send(result)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)

    if (error) {
        res.status(400).send(error.details[0].message)
    }

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) {
        return res.status(400).send("Customer with this ID does not exist")
    }

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) {
        return res.status(400).send("Movie with this ID does not exist")
    }

    let rental = new Rental({
        customer: {
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    rental = await rental.save()
    res.send(rental)

})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router
