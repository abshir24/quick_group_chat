// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();

var bodyParser = require('body-parser');

// var session = require('express-session');

// app.use(session({secret: 'keyboardkitteh',resave: false,saveUninitialized: true,cookie: { maxAge: 60000 }}))

// use it!
app.use(bodyParser.urlencoded({ extended: true }));

// static content

app.use(express.static(path.join(__dirname, "./static")));

const server = app.listen(8000,function(){
    console.log("Running on port 8000")
});
const io = require('socket.io')(server);

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view



const users = [];

const messages = [];


io.sockets.on("connection", function(socket) {
    socket.on('new_user',function(data){
       users.push(data.user)

       socket.emit('load_page',{allmessages:messages})
       
       socket.broadcast.emit('new_user', {message:`${data.user} has joined the group`})

    })

    socket.on('new_message',function(data){
      
      messages.push({user:data.user,message:data.message})

      io.emit('post_message',{user:data.user,message:data.message})
      
   })
});

  app.get("/", function(request, response){
        response.render("index")
  });



// tell the express app to listen on port 8000




// io.on('connection', function (socket) { 
//     var messages = []
//     socket.on('get_new_user', function (data){

//         socket.emit('me',{name:data.username})

//         socket.broadcast.emit('new_user',{name:data.username})
//     });

//     socket.on('new_message', function (data){
//         messages.push(`${data.username}: ${data.newmessage}`)
//         console.log(messages)

//         let len = messages.length-1;

//         // socket.emit('mymessage',{message:messages[len]})

//         io.local.emit('allmessages',{message:messages[len]})
//     });

//     // socket.on('reset', function (data) { //7
//     //     count=0
//     //     socket.emit('response',{counter:count})
//     // });

// });

