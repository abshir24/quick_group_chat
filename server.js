
var express = require("express");

var path = require("path");

var app = express();

var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));

// static content

app.use(express.static(path.join(__dirname, "./static")));

const server = app.listen(8000,function(){
    console.log("Running on port 8000")
});

const io = require('socket.io')(server);

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

const users = [];

const messages = [];

let checkUser = (user)=>{
    for(let i = 0;i<users.length;i++)
    {
      if(users[i] == user)
      {
        return true
      }
    }
    return false
}

io.sockets.on("connection", function(socket) {
    socket.on('new_user',function(data){

       if(checkUser(data.user))
       {

        socket.emit('existing_user',{message:"User already exists fam"})

       }else{

        users.push(data.user)

        socket.emit('load_page',{allmessages:messages})
          
        socket.broadcast.emit('new_user', {message:`${data.user} has joined the group`})
       }
    })

    socket.on('new_message',function(data){
      
      messages.push({user:data.user,message:data.message})

      io.emit('post_message',{user:data.user,message:data.message})
      
   })
});

app.get("/", function(request, response){
      response.render("index")
});



