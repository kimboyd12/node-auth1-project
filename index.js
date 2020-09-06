const express = require("express")
const usersRouter = require("./users/users-router")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("./database/config")


const server = express()
const port = 5000

server.use(express.json())
server.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "secret secret, i got a secret",
        store: new KnexSessionStore({
            knex: db, 
            createtable: true
        })
    })
)

server.use(usersRouter)

server.use((err, req, res, next) => {
    console.log(err)

    res.status(500).json({
        message: "Something went wrong"
    })
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})