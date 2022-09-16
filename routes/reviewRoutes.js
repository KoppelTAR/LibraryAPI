const express = require('express');
const router = express.Router();
const bookSchema = require('../models/book');
const userSchema = require('../models/user');
const reviewSchema = require('../models/review');

router.get('/reviews', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(reviews)
        })
    }
})


router.post('/reviews', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        if(!req.query.title ||
            !req.query.body ||
            !req.query.rating ||
            !req.query.bookId ||
            !req.query.authorId){
                return res.status(400).send({ error: 'One or all params are missing. Required params: title, body, bookId, authorId, rating' })
            }
            else{
                bookSchema.findOne({_id: req.query.bookId}, function(err, book){
                    if(book == null) return res.status(404).send({error:"Looks like we couldn't find the book you were looking for."})
                    userSchema.findOne({_id: req.query.authorId}, function(err, user) {
                        if(user == null) return res.status(404).send({error:"Looks like we couldn't find the user you were looking for."})
                        let newReview = new reviewSchema({
                            title: req.query.title,
                            body: req.query.body,
                            rating: req.query.rating,
                            book: book,
                            author: user
                        })
                        newReview.save()
                        return res.status(201).send('Review added!')
                    })
                })
            }
    }
})

router.get('/reviews/book/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({"book._id": req.params.id}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(reviews)
        })
    }
})

router.get('/reviews/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({_id: req.params.id}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(reviews)
        })
    }
})

router.get('/reviews/author/:id', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.find({"author._id": req.params.id}, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.send(reviews)
        })
    }
})

router.put('/reviews', (req, res) => {
    if(!req.query.key){
        return res.status(401).send({error: 'Missing API key'});
    }
    else if(req.query.key != process.env.API_KEY){
        return res.status(403).send({error: 'Invalid API key'});
    }
    else{
        reviewSchema.findOneAndUpdate({_id: req.query.id}, req.query, function(error, reviews){
            if(reviews == null) return res.status(404).send({error:"Looks like we couldn't find what you were looking for."})
            if(error) return res.status(500).send({error:'Looks like something went wrong :('})
            if(reviews != null) return res.status(200).send('Review updated!')
        }) 
    }
})

router.delete('/reviews/:id', (req, res) => {
    if (!req.query.key) {
        return res.status(401).send({ error: 'Missing API key' });
    }
    else if (req.query.key != process.env.API_KEY) {
        return res.status(403).send({ error: 'Invalid API key' });
    }
    else {
        reviewSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
            if (response == null) return res.status(404).send({ error: "Looks like we couldn't find what you were looking for." })
            if (err) return res.status(500).send({ error: 'Looks like something went wrong :(' })
            if (response != null) {
                return res.status(204).send()
            }
        });
    }
})

module.exports = router;