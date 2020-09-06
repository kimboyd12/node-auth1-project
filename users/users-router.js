const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./users-model")
const usersMiddleware = require("./users-middleware")
const e = require("express")

const router = express.Router()


// get users
router.get("/api/users", usersMiddleware.restrict(), async (req, res, next) => {
    try {
        res.json(await Users.get())
    } catch(err) {
        next(err)
    }
})

// add user
router.post("/api/register", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if(user) {
            return res.status(409).json({
                message: "Username is already taken"
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14)
        })
        
        res.status(201).json(newUser)

    } catch(err) {
        next(err)
    }
})

// login
 router.post("/api/login", async (req, res, next) => {
     try {
        const { username, password } = req.body
        const user = await Users.findBy({ username }).first()

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const passwordvalid = await bcrypt.compare(password, user.password)

        if (!passwordvalid) {
            return res.status(401).json({
                message: "Invalid credenitals"
            })
        }

        req.session.user = user

        res.json({
            message: `Welcome ${user.username}!!!`
        })

     } catch(err) {
         next(err)
     }
 })

// logout
router.get("/api/logout", usersMiddleware.restrict(), async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err)
            } else {
                res.status(204).end()
            }
        })
    } catch(err) {
        next(err)
    }
})





module.exports = router