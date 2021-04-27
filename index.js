const Joi = require('joi');
const express = require('express');
const { validate } = require('joi/lib/types/object');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'react'},
    {id: 2, name: 'redux'},
    {id: 3, name: 'webpack'}
];

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // result.error

    if(error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send('The course with given id is not found');
    }
    

    // Validate
    const { error } = validateCourse(req.body); // result.error

    if(error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    // update course
    course.name = req.body.name;
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id is not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})



function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}


app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with given id is not found');
    res.send(course);
})

// PORT
const port = process.env.PORT || 5500;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
