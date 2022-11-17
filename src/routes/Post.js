const express = require('express');
const router = new express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken');
const e = require('express');


router.post("/posts", async (req, res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];

        // try {
        decoded = jwt.verify(authorization, 'secret');
        console.log(decoded);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.data;
        let user = await User.findOne({ _id: userId });
        console.log(user._id);
        if (user) {

            // return res.status(200).json({
            //     status: "Success",
            //     user
            // });

            let post = await Post.create({
                ...req.body,
                user: decoded.data
            })

            return res.status(200).json({
                status: "Post Created",
                data: post
            });


        }

    }
    return res.send(500);
})



router.get("/posts", async (req, res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];

        // try {
        decoded = jwt.verify(authorization, 'secret');
        console.log(decoded);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.data;
        let user = await User.findOne({ _id: userId });
        console.log(user._id);
        if (user) {

            // return res.status(200).json({
            //     status: "Success",
            //     user
            // });

            let post = await Post.find({
                user: userId
            })

            return res.status(200).json({
                status: "Success",
                data: post
            });


        }

    }
    return res.send(400);
})

router.put("/posts/:id", async (req, res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];

        // try {
        decoded = jwt.verify(authorization, 'secret');
        console.log(decoded);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.data;
        let user = await User.findOne({ _id: userId });
        console.log(user._id);
        if (user) {
            try {
                let post = await Post.updateOne({ _id: req.params.id }, req.body)
                return res.status(200).json({
                    status: "Success",
                    data: post
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: "Failed",
                    message: e.message
                });
            }



        }

    }
    return res.send(500);
})


router.delete("/posts/:id", async (req, res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];

        // try {
        decoded = jwt.verify(authorization, 'secret');
        console.log(decoded);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.data;
        let user = await User.findOne({ _id: userId });
        console.log(user._id);
        if (user) {
            try {
                let post = await Post.deleteOne({ _id: req.params.id })
                return res.status(200).json({
                    status: "Success",
                    data: post
                });
            }
            catch (e) {
                return res.status(500).json({
                    status: "Failed",
                    message: e.message
                });
            }



        }

    }
    return res.send(500);
})

module.exports = router