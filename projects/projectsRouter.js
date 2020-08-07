const express = require('express')

const projects = require('../data/helpers/projectModel')

const router = express.Router()

router.get('/', (req, res) => {
    projects.get()
    .then(project => {
        res.status(200).json(project)
    })
    .catch(error => {
        res.status(500).json({ message: 'Error retrieving projects' })
    })
})

router.get('/:id', validateProjectId, (req, res) => {
    projects.get(req.params.id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => console.log(error))
})

router.post('/', validateProject, (req, res) => {
    projects.insert(req.body)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(error => console.log(error))
})






// Custom Middleware

function validateProjectId(req, res, next){
    const id = req.params.id
    projects.get(id)
    .then(data => {
        if(data) {
            next()
        }else{
            res.status(400).json({
                errorMessage: `Action Id ${req.params.id} does not exist`
            })
        }
    })
}

function validateProject(req, res, next) {
    const { description, name } = req.body
    if(description && name) {
        next()
    }else{
        res.status(400).json({ errorMessage: `Please add description and name fields` })
    }
}



module.exports = router;