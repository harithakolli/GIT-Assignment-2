const express     = require('express');
const router      =  new express.Router()
const Post        = require('../models/Post')
const User        = require('../models/User')
const {ObjectID}  = require('mongodb')
const jwt = require('jsonwebtoken');


router.post("/posts", async (req,res) => {
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1];
       
        // try {
            decoded = jwt.verify(authorization, 'secret');
            console.log(decoded);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.data;
        let user = await User.findOne({_id: userId});
        console.log(user._id);
        if(user){

            // return res.status(200).json({
            //     status: "Success",
            //     user
            // });
       
                let post =  await Post.create({
                    ...req.body,
                    user: decoded.data
                })

                return res.status(200).json({
                    status : "Post Created",
                    data: post
                });
          
           
        }
      
    }
    return res.send(500);
})

module.exports = router