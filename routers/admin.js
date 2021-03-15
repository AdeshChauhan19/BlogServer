const express = require('express')
const authAdmin = require('../middleware/authadmin')
const Admin = require('../models/admin')
const Post=require('../models/post');
const router = new express.Router()

router.post('/admin', async (req, res) => {
    const admin = new Admin(req.body)

    try {
        await admin.save()
        const admintoken = await admin.generateAuthToken()
        console.log(admintoken);
        res.status(201).send({ admin, admintoken })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admins/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const admintoken = await admin.generateAuthToken()
        res.send({ admintoken })
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/admin/allpost', authAdmin,async(req,res)=>{
    try{
        const posts=await Post.find({approved:"false"});
        
        res.send(posts)
    }
    catch(e){
        res.status(500).send();
    }
})

router.get('/admin/approved/:id',authAdmin,async(req,res)=>{
    // const updates=Object.keys(req.body);
    // const allowedUpdates=['approved']
    // const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }
    // try {
    //     const post = await Post.findOne({ _id: req.params.id})
    //     console.log(post)
    //     if (!post) {
    //         return res.status(404).send()
    //     }
    //     console.log(post.approved);
    //     post.approved=true
    //     updates.forEach((update) => post[update] = req.body[update])
    //     await post.save()
    //     res.send(post)
    // } catch (e) {
    //     res.status(400).send(e)
    // }
    try {
        const post = await Post.findOne({ _id: req.params.id})
        post.approved=true;
        await post.save()
        res.send(post)
    } catch (error) {
        res.status(400).send(e)
    }
})

router.post('/admins/logout', authAdmin, async (req, res) => {
   
    try {
       
        req.admin.admintokens = req.admin.admintokens.filter((admintoken) => {
            return admintoken.admintoken !== req.admintoken
        })
        await req.admin.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports=router
