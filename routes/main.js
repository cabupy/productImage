const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  Story.find({user:req.user.id})
  .then(stories => {
    res.render('index/dashboard', {
      stories: stories
    });
  }); 
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;