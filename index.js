require('dotenv').config()
const express =require('express') 
const Person = require('./modules/person')
const app=express()

app.use(express.json())
app.use(express.static('build'))

// let persons =[
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4, 
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/info',(req,res)=>{
    res.send(`<h1>PhoneBook has info of ${persons.length} people</h1> <br> ${new Date}`)
})

app.get('/api/persons',(req,res)=>{
    Person.find({}).then(person=> res.json(person))
   
})

app.get('/api/persons/:id',(req,res,next)=>{
    Person.findById(req.params.id)
    .then(person=>{
      if(person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
    //  {
    //     console.log("error console",error)
    //     res.status(400).send({ error: 'malformatted id' })
    // })
})
// const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(n => n.id))
//       : 0
//     return maxId + 1
//   }
app.post('/api/persons',(req,res)=>{
    const body=req.body
    console.log(body)
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(person=>{console.log("contact saved") 
    res.json(person)})
    //  if(!body.name)
    // {
    //     return res.status(400).json({ 
    //        error: 'Name is missing' 
    //      })
    // }
    // else if(!body.number)
    // {
    //     return res.status(400).json({ 
    //        error: 'Number is  missing' 
    //        })
    //  }
    // else if(persons.filter((person)=>person.name===body.name).length!==0)
    //  {
    //  return res.status(400).json({ 
    //         error: 'NAME ALREADY exists' 
    //       })
    // }
    
})

app.put('/api/persons/:id',(req,res,next)=>{
  const body = req.body
  const personObj = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, personObj, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(req,res)=>{
  const id = Number(req.params.id)
    Person.findByIdAndRemove(req.params.id).then(result => {
      res.status(204).end()
    })
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })