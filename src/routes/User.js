const express     = require('express');
const router      =  new express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User        = require('../models/User')
const {ObjectID}  = require('mongodb')


router.post('/register', body("email").isEmail(), body('name').isAlpha(), body('password').isLength({ min: 5, max: 16 }), async (req,res) => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //step 2
        const { name, email, password } = req.body
       // checking if user alraedy registered
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                status: "Failed!",
                message: "Email already exists"
            });
        }

        // loading of hash value in passwords
        bcrypt.hash(password, 10, async function (err, hash) {
            // console.log(err, hash);
            if (err) {
                return res.status(400).json({
                    status: "Failed",
                    message: err.message
                });
            }

            const user = await User.create({
                name,
                email,
                password: hash
            })

            return res.json({
                status: "Success",
                message: "Successfully Registered",
                user                                         
            })
        });

    }
    catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
    }
})


//Login

router.post("/login", body("email").isEmail(),
    async (req, res) => {

        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //step 2
            const { email, password } = req.body

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    status: "failed",
                    message: "No such user exists"
                });
            }
            bcrypt.compare(password, user.password, function (err, result) {           //this compares the hashed password with the password provided in users body,1st argument is string value  second is hashed value

                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    });
                }

                if (result) {
                   //token will be used to track the user for further operations..
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),                                                         // this is optional and expiry time ..
                        data:user._id                                            // this we have to set
                    }, "secret");

                    return res.status(200).json({
                        status: "Success",
                        token
                    });
                }

                else {
                    return res.status(401).json({
                        status: "Failed",
                        message: "Invalid credential"
                    });
                }

            });
        }

        catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }

    });



module.exports = router