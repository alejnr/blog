const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const ejs = require('ejs')
const _ = require('lodash')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true})

const defaultContentSchema = new mongoose.Schema({
  name: String,
  content: String
})

const DefaultContent = mongoose.model('DefaultContent', defaultContentSchema)

const homeStartingContent = new DefaultContent({
  name: 'homeStartingContent',
  content: 'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.'
})

const aboutContent = new DefaultContent({
  name: 'aboutContent',
  content: 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.'
})

const contactContent = new DefaultContent({
  name: 'contactContent',
  content: 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.'
})

const defaultContents = [homeStartingContent, aboutContent, contactContent]



const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please check your data entry, no title specified!']
  },
  content:  {
    type: String,
    required: [true, 'Please check your data entry, no post specified!']
  }
})

const Post = mongoose.model('Post', blogSchema)


app.get('/', function (req, res) {
  const kebabCase = _.kebabCase

  DefaultContent.find(function(err, contents) {

    if (contents.length === 0) {
      DefaultContent.insertMany(defaultContents, function(err) {
            if (err) {
              console.log(err);
            } else {
                res.redirect('/')
            }
          })
    } else {

      Post.find({}, function (err, newPost) {

        res.render('home', {
          startingContent: homeStartingContent.content,
          newPost: newPost,
          kebabCase: kebabCase,
        })
      })
      
    }
    
  })

})

app.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent.content })
})

app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent.content })
})

app.get('/compose', function (req, res) {
  res.render('compose')
})

app.get('/posts/:postId', function (req, res) {
  const requestedId = req.params.postId

  Post.findOne({_id: requestedId}, function (err, foundPost) {
    
    if (foundPost) {
      res.render('post', { requestedPost: foundPost })
    } else {
      res.redirect('/')
    }
  })
  
})

app.post('/compose', function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  }

  const newPost = new Post({
    title: post.title,
    content: post.content
  })

  newPost.save(function(err){
    if (!err){
      res.redirect("/");
    }
  })

})

app.use(function (req, res) {
  res.status(404).render('404')
})

app.listen(port, function () {
  console.log('Server started on port', port)
})
