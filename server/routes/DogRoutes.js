const ensureAuthenticated = require('../middlewares/Auth');

const router = require('express').Router();

router.get('/', ensureAuthenticated, (req, res) => {
    console.log('---- logged in user detail ---', req.user);
    res.status(200).json([
        {
            name: "Arnold",
            age: 2
        },
        {
            name: "Franz",
            age: 3
        }
    ])
});

module.exports = router;