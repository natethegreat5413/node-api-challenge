const express = require('express')

const projects = require('../data/helpers/projectModel')

const router = express.Router()

// GET ALL
router.get('/', (req, res) => {
    projects.get()
    .then(project => {
        res.status(200).json(project)
    })
    .catch(error => {
        res.status(500).json({ message: 'Error retrieving projects' })
    })
})

// GET BY ID
router.get('/:id', validateProjectId, (req, res) => {
    projects.get(req.params.id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(error => console.log(error))
})

// POST NEW PROJECT
router.post('/', validateProject, (req, res) => {
    projects.insert(req.body)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(error => console.log(error))
})


// UPDATE
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    const projectId = req.params.id;
    const body = req.params

    projects.update(projectId, body)
    .then(data => {
        if(data){
            projects.get(projectId)
            .then(response => {
                res.status(200).json({
                    message:`User ${projectId} successfully updated!`
                })
            })
            .catch(error => {
                console.log(error)
            })
        }
    })
    .catch(error => {
        console.log(error)
    })
})

// DELETE PROJECT
router.delete('/:id', validateProjectId, (req, res) => {
    projects.remove(req.params.id)
    .then(data => {
        res.status(200)
    })
    .catch(error => console.log(error))
})

// GET PROJECT ACTIONS
projects.get('/:id/actions', validateProjectId, (req, res) => {
    const id = req.params.id
    projects.getProjectActions(id)
    .then(data => {
        res.status(200).json(data)
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