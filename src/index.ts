import express, { application } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

//users

app.get("/", (req, res) => {
    res.send(`
    <ul> RESOURCES 
    <li><a href="/users">USERS</a></li>
    <li><a href="/hobbies">HOBBIES</a></li>
    <ul> 
    `)
})

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({ include: { hobbies: true } })
    res.send(users)
})

app.get("/users/:id", async (req, res) => {
    const id = Number(req.params.id)
    const singleUser = await prisma.user.findUnique({ where: { id: id }, include: { hobbies: true } })

    if (singleUser) {
        res.send(singleUser)
    }

    else {
        res.status(404).send({ error: "User not found." })
    }

})

app.post("/users", async (req, res) => {
    const newUser = await prisma.user.create({
        data: {
            name: req.body.name,
            photo: req.body.photo,
            email: req.body.email,
            hobbies: {
                // @ts-ignore
                connectOrCreate: req.body.hobbies.map(hobby => ({
                    where: { name: hobby },
                    create: { name: hobby }
                })
                )
            }
        },
        include: { hobbies: true }
    })
    res.send(newUser)
})

app.patch("/users/:id", async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.update({
        where: { id: id },
        data: {
            name: req.body.name,
            photo: req.body.photo,
            email: req.body.email,
            hobbies: {
                // @ts-ignore
                connectOrCreate: req.body.hobbies.map(hobby => ({
                    where: { name: hobby },
                    create: { name: hobby }
                })
                )
            }
        },
        include: { hobbies: true }
    })
    if (user) {
        res.send(user)
    }
    else {
        res.status(404).send({ error: "No user found." })
    }
})

// app.delete("/users/:id", async (req, res) => {
//     const id = Number(req.params.id)
//     const deletedUser = await prisma.user.delete({ where: { id: id } })
//     res.send(deletedUser)
// })

// hobbies

app.get("/hobbies", async (req, res) => {
    const hobbies = await prisma.hobby.findMany({ include: { users: true } })
    res.send(hobbies)
})

app.get("/hobbies/:id", async (req, res) => {
    const id = Number(req.params.id)
    const singleHobby = await prisma.hobby.findUnique({ where: { id: id }, include: { users: true } })

    if (singleHobby) {
        res.send(singleHobby)
    }
    else {
        res.status(404).send({ error: "Hobby not found." })
    }

})

// app.post("/hobbies", async (req, res) => {
//     const newHobby = await prisma.hobby.create({ data: req.body, include: { user: true } })
//     res.send(newHobby)
// })

// app.patch("/hobbies/:id", async (req, res) => {
//     const id = Number(req.params.id)
//     const hobby = await prisma.hobby.update({ where: { id: id }, data: req.body , include: {user:true}})
//     if (hobby) {
//         res.send(hobby)
//     }
//     else {
//         res.status(404).send({ error: "Hobby not found." })
//     }
// })

// app.delete("/hobbies/:id", async (req, res)=>{
//     const id=Number(req.params.id)
//     const deletedHobby= await prisma.hobby.delete({where: {id:id}})
//     res.send(deletedHobby)
// })

app.listen(port)