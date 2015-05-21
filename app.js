var express = require('express'),
    // Initialized Express application
    app = express(),
    path = require('path'),
    // ORM for mongodb
    mongoose = require('mongoose'),
    // Logs our HTTP requests
    morgan = require('morgan'),
    // Gives us POST params in request.body
    bodyParser = require('body-parser'),
    // Simulate PUT & DELETE
    methodOverride = require('method-override');


// Connect our application to our local mongodb
mongoose.connect('mongodb://localhost:27017/blogs');

// Set up my model
var Blog = mongoose.model('Blog', {
    title: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});


// Configure my application to use jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Use my middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Establish the routes for our application

// Index action
app.get('/', function(request, response){
    Blog.find(function(error, blogs){
        if(error){
            response.send(error);
        }
        response.render('blogs/index', {title: 'Blogs', blogs: blogs});
    });
});

// New

    app.get('/blogs/new', function(request, response){
        response.render('blogs/new', {
            title: "Create a blog"
        });
    });

// Create

    app.post('/blogs', function(request, response){
        var blog = new Blog();
        blog.title = request.body.title;
        blog.content = request.body.content;

        blog.save(function(error){
            if(error){
                response.send(error);
            }
            response.redirect('/');
        });
    });
// Show
app.get('blogs/:id', function(request, response){
    Blog.findOne({_id: request.params.id}, function(error, blog){
        if(error){
                response.send(error);
    }
response.render('blogs/show', {
    title: blog.title,
    blog:blog
});
});
});
//edit
app.get('blogs/:id/edit', function(request, response){
    Blog.findOne({_id: request.params.id}, function(error, blog){
        if(error){
                response.send(error);
    }
response.render('blogs/edit', {
    title: 'Edit this blog',
    blog:blog
});
});
});
// UPDATE
app.put('/blogs/:id', function(request, response){
    Blog.update({_id: request.params.id}, {
        title: request.body.title,
        content: request.body.content
    }, function(error, blog) {
        if(error){
            response.send(error);
        }
    });
});

// destroy
app.delete('/blogs/:id', function(request, response){
    Blog.findByIdAndRemove(request.params.id, function(error){
        if(error){
            response.send(error);
        }
    });
});

app.listen(3000);
console.log('App is listening on port 3000');














