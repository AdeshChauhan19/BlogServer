const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const adminRouter=require('./routers/admin')
const Comment = require('./models/comment');
const Post=require('./models/post')
const auth = require('./middleware/auth')
const cors=require('cors');


const app = express()
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(adminRouter)

app.get('/post',async(req,res)=>{
    try{
        const approvedpost=[]
        const posts=await Post.find({}).populate('comments').lean();
        posts.forEach((post)=>{
            if(post.approved===true){
                approvedpost.push(post);
            }
        })
        res.send(approvedpost);
    }
    catch(e){
        res.status(500).send();
    }

})

// CREATE Comment
// app.post("/posts/:postId/comments", function(req, res) {
//   // INSTANTIATE INSTANCE OF MODEL
//   const comment = new Comment(req.body);
//  // SAVE INSTANCE OF Comment MODEL TO DB
//   comment
//     .save().then(comment => {
//       return Post.findById(req.params.postId);
//     })
//     .then(post => {
//       post.comments.push(comment);
//       return post.save();
//     })
//     .then(post => {
//       res.send(post);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

app.post("/posts/:postId/comments",auth,function (req, res) {
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    comment
        .save()
        .then(comment => {
            return Promise.all([
                Post.findById(req.params.postId)
            ]);
        })
        .then(([post, user]) => {
            post.comments.unshift(comment);
            return Promise.all([
                post.save()
            ]);
        })
        .then(post => {
            res.send(post);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/posts/:postId/comments/:commentId/replies",auth, (req, res) => {
    // TURN REPLY INTO A COMMENT OBJECT
    const reply = new Comment(req.body);
    reply.author = req.user._id
    // LOOKUP THE PARENT POST
    Post.findById(req.params.postId)
        .then(post => {
            // FIND THE CHILD COMMENT
            Promise.all([
                reply.save(),
                Comment.findById(req.params.commentId),
            ])
                .then(([reply, comment]) => {
                    // ADD THE REPLY
                    res.status(200).send(comment)
                    comment.comments.unshift(reply._id);

                    return Promise.all([
                        comment.save(),
                    ]);
                })
                .catch(console.error);
            // SAVE THE CHANGE TO THE PARENT DOCUMENT
            return post.save();
        })
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})