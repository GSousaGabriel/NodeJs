exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: "test title",
            content: "test content"
        }]
    })
}

exports.postPost = (req, res, next) => {
    const title= req.body.title
    const content= req.body.content
    
    //create a post
    res.status(201).json({
        message: "Successfully created",
        post: {id: new Date().toISOString(), title, content}
    })
}