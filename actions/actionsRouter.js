const express = require('express')

const actions = require('../data/helpers/actionModel')

const router = express.Router()

router.get('/', (req, res) => {
    actions.get()
    .then(action => {
        res.status(200).json(action)
    })
    .catch(error => {
        res.status(500).json({ message: 'Error retrieving actions' })
    })
})

router.get('/:id', validateActionId, (req, res) => {
    actions.get(req.params.id)
    .then(action => {
        if (action) {
            res.status(200).json(action)
        }else{
            res.status(400).json({ message: 'Action not found!' })
        }
    })
})

router.post('/', validateActionId, validateAction, (req, res) => {
    const newAction = req.body;

    actions.insert(newAction)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => {
        console.log(error)
    })

})

router.put('/:id', validateActionId, validateAction, (req, res) => {
    const post = req.body;
    const postId = req.params.id;

    actions.update(postId, post)
    .then(updated => {
        res.status(200).json({ message: `User id ${postId} has been updated` })
    })
    .catch(error => console.log(error))
})

router.delete('/:id', validateActionId, (req, res) => {
    const postId = req.params.id;

    actions.remove(postId)
    .then(data => {
        res.status(200).json({ message: `User ${postId} was deleted`})
    })
   .catch(error => console.log(error)) 
})




// Custom middleware

function validateActionId(req, res, next) {
    const id = req.params.id;
    actions.get(id)
    .then(data => {
        if(data) {
            next()
        }else{
            res.status(400).json({ errorMessage: `Action ID ${req.params.id} does not exist` })
        }
    })
}

function validateAction(req, res, next) {
    const { description, notes } = req.body;

    if(!description || !notes){
        return res.status(400).json({ errorMessage: 'Please add description and notes' })
    }
    if(description.length > 128){
        return res.status(400).json({ errorMessage: 'Please post over 128 characters' })
    }
    next()
}


module.exports = router;