// Import Express
const express = require('express')

const router = express.Router()

router.get('', (req,res) => {
    res.render('pages/frontend/index', {title: 'Home'})
})



module.exports = router