const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");

const app = express();
const dotenv = require("dotenv");
const connectDB = require("./Server/database/connection"); 


const PORT = process.env.PORT || 8080;
connectDB();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("view enginge","ejs");

app.use("/", require("./Server/routes/router"));

app.use("/js",express.static(path.resolve(__dirname,"Assets/js")));
app.use("/img", express.static(path.resolve(__dirname,"Assets/img")));

app.use("/", require("./Server/routes/router"));

var server = app.listen(PORT, ()=>{
    console.log('server is running in motherfucker ;)', PORT);
});

const io = require("socket.io")(server, {
    allowEIO3: true,
});     

var userConnection = [];    

io.on("connection", (socket) => {
    console.log("socket id is : ", socket.id);

    socket.on("userconnect", (data) => {
        console.log("username ", data.displayName);
        userConnection.push({
            connectionId: socket.id,
            user_id: data.displayName,
        });

        var userCount = userConnection.length;
        console.log("no. of users =", userCount);
    });
    socket.on("offerSentToRemote", (data) => {
        var offerReceiver = userConnection.find(
            (o)=>o.user_id===data.remoteUser
        );
            if(offerReceiver){
                console.log("offerReceiver user is :",offerReceiver.connectionId);
                socket.to(offerReceiver.connectionId).emit("ReceiveOffer", data);
            }
        });
    socket.on("answerSentToUser1", (data) => {
        var answerReceiver = userConnection.find(
            (o)=>o.user_id===data.receiver
        );
        if(answerReceiver){
            console.log("answerReceiver user is :",answerReceiver.connectionId);
            socket.to(answerReceiver.connectionId).emit("ReceiveAnswer", data);
        }
    });
    socket.on("candidateSentToUser", (data) => {
        var candidateReceiver = userConnection.find(
            (o)=>o.user_id===data.remoteUser
        );
            if(candidateReceiver){
                console.log("candidateReceiver user is :",candidateReceiver.connectionId);
                socket.to(candidateReceiver.connectionId).emit("candidateReceiver", data);
            }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        var disUser = userConnection.find((p) => (p.connectionId = socket.id));
        if(disUser){
            userConnection = userConnection.filter((p)=>(p.connectionId != socket.id));
            console.log("Rest user available: ",userConnection.map(function(user) {
                return user.user_id;
            })
            );
        }
    });
});
