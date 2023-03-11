const User = require('../models/user')

exports.getStatus = ((req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            res.status(200).json({ message: "success", status: user.status })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
})

exports.putStatus = ((req, res, next) => {
    const status= req.body.status

    User.updateOne({_id: req.userId}, {status})
    .then(user => {
        res.status(200).json({ message: "success", status: user.status })
    })
    .catch(error => {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    })
})