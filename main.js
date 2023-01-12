var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    gameJS = require('./import'),
    playerAuth = require('./playersAuth'),
    validator = require('validator'),
    cors = require('cors')
    clone = require('clone'),
    jsonpatch = require('fast-json-patch'),
    config = require('./config');
    const mongoose = require('mongoose'); 
    const GameController = require('./Controller/GameController'); 
    const adminRouter = require('./routes/adminRouter');
    const userRouter = require('./routes/userRouter');
  const {add_game,update_game,getDataById } = require('./helper/game_fun_helper');
  const google = require("./routes/googleLogin")
  const session = require('express-session');
const jwt = require('jsonwebtoken')
const rooms_Model = require("./models/Rooms_players")

const { contains } = require('jquery');

var app = require('express')()
    , server = require('http').createServer(app)

    , io = require('socket.io').listen(server, {path: config.baseUrl + 'socket.io'});

app.start = app.listen = function () {
    return server.listen.apply(server, arguments)
}

app.use(bodyParser.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cors())
app.use(session({ secret: 'melody hensley is my spirit animal' }));
 
var router = express.Router();
router.use(express.static(path.join(__dirname, 'public')));

app.use("/web_api",adminRouter);
app.use("/api",userRouter);
app.use(config.baseUrl, router);
app.start(config.port);
app.use('/', google)

console.log("Server started on port " + config.port + ".");

var games = [], gamesObserver = [];
gameJS.setSocket(io);
gameJS.setPlayerAuth(playerAuth);

var defaultGameSettings = {
    idleTimeout: 20000,
    idleKickTurns: 4,
    idleKickTurnsTotal: 7,
    boardSize: 4
};

router.get('/rest/game', function (req, res) {
    if (req.query.gameid >= games.length)
        return res.status(404).send();  

    games[req.query.gameid].timeLeftTurn = (
        (games[req.query.gameid] && games[req.query.gameid].status === 1) ?
            ((games[req.query.gameid].idleTimeout - ((new Date()).getTime() - games[req.query.gameid].lastMoveTime.getTime())) / 1000) : 0);
    
            res.json(games[req.query.gameid]);
});

// router.get('/', function (req, res) {
//     res.render('createNickname', {'baseUrl': config.baseUrl});
// });
// router.get('/', function (req, res) {
//     res.render('splash-screen', {'baseUrl': config.baseUrl});
// });

router.post("/update_dash_color", function (req, res){
    gameJS

    
})

router.get('/', function (req, res) {
    res.render('splash', {'baseUrl': config.baseUrl});
});
router.get('/index', function (req, res) {
    res.render('index', {'baseUrl': config.baseUrl});
});

router.get('/lobby', function (req, res, next) {
    res.render('lobby', {'baseUrl': config.baseUrl});
});


router.get('/adminGame/:u_name?/:u_id?', function (req, res, next) {

  let u_name = req.params.u_name;
  let u_id =  req.params.u_id;  // baseUrlFullPath
    res.render('admin_user_view', {'baseUrlFullPath': config.baseUrlFullPath,'baseUrl': config.baseUrl,u_name,u_id});
});
  

router.get('/game', function (req, res) {
    res.render('game2', {'baseUrl': config.baseUrl});
});

router.use('/rest/lobby', function (req, res, next) {
    playerAuth.auth(req, res, next);
});

router.get('/rest/lobby', function (req, res) {
    res.json({
        success: true,
        players: playerAuth.getLobbyPlayers()
    });
});

router.post('/rest/lobby', function (req, res) {
    if (req.body.action == "startGame") {
        let readyPlayers = playerAuth.getReadyPlayers()
        if (readyPlayers.length) startGame(readyPlayers, defaultGameSettings);
    } else if (req.body.action == "ready") {
        playerAuth.setReady(req.decoded.playerId, true);

        setTimeout(function () {
            let readyPlayers = playerAuth.getReadyPlayers();

            if (readyPlayers.length >= 4) {
                let playersToGame = [];
                for (let i = 0; i < 4; i++) {
                    playersToGame[i] = readyPlayers[i];
                }
                startGame(playersToGame, defaultGameSettings);
                io.emit('lobby', "");
            }
        }, 1000);
    } else if (req.body.action === "unready") {
        playerAuth.setReady(req.decoded.playerId, false);
    }

    io.emit('lobby', "");
    res.send();
});

router.use('/rest/game', function (req, res, next) {
    playerAuth.auth(req, res, next);
});

router.post('/rest/game', async function (req, res) {

    let before = clone(games[req.query.gameid]);

    if (req.body.chatmessage != null) {
        if (req.body.chatmessage.length > 80) return res.status(422).send("Too long message");

        if (playerAuth.chatDOSCheck(req.decoded.playerId)) return res.status(422).send("Too many messages");;

        console.log("Player: " + req.decoded.playerId + " sent message '" + req.body.chatmessage + "' in game " + req.query.gameid);
        gameJS.postChatMessage(games[req.query.gameid], playerAuth.getPlayerById(req.decoded.playerId), req.body.chatmessage, "#ffffff");

        sendUpdate(games[req.query.gameid].gameId);

        return res.send("posted");
    }
   
    if (req.body.leave != null) {
        console.log("Player: " + req.decoded.playerId + " left game '" + req.query.gameid);
        gameJS.leaveGame(games[req.query.gameid], playerAuth.getPlayerById(req.decoded.playerId));

        sendUpdate(games[req.query.gameid].gameId,myCallback);

        return res.send("posted");
    }
    let Gcount = await gameJS.gameLogic(games[req.query.gameid], req.decoded.playerId, req.body.pos, req.body.chipsToMove, req.body.moveChipsIn);
   console.log("Gcount == ",Gcount);
    switch (Gcount) {
        case 1:
            sendUpdate(games[req.query.gameid].gameId,myCallback);
            break;
        case 2:
            let players = games[req.query.gameid].players;
            for (let i = 0; i < players.length; i++) playerAuth.setIngame(players[i].playerId, false);
            sendUpdate(games[req.query.gameid].gameId,myCallback);
            break;
       
            default:
            break;
    }

    res.send("test");
});

router.use('/rest/games', function (req, res, next) {
    playerAuth.auth(req, res, next);
});

router.get('/rest/games', function (req, res) {
    res.json(games);
}); 

router.post('/rest/regPlayer', function (req, res) {
    let Random_name = (Math.random() + 1).toString(36).substring(7);
    

    let roomstatus = req.body.room_ID;

    console.log("consoleeeeeeeeee_rooooom_IIIIIDDDDD", roomstatus)

    var player_ID = ""
    var room_ID = ""
    if (!roomstatus) {
        // function game_id() {
        //     return Math.floor(Math.random() * 800000) + 100000;
        // }

        room_ID = Math.floor(Math.random() * 800000) + 100000;
        player_ID = 0
        console.log("1231231231321321321321231231LODULODULODULDOULODULODULODULODULODULO(DU", room_ID)
    } else {
        room_ID = parseInt(req.body.room_ID);
        player_ID = 1
    }

    console.log("ROOM_STATUS", roomstatus)

   // req.body.playerName = validator.escape(Random_name);

    if (Random_name == null)
        return res.json({success: false, message: 'No nickname given.'});
    if (playerAuth.playerExists(Random_name) || Random_name == null)
        return res.json({success: false, message: 'Nickname is already in use.'});
    if (Random_name.length < 3 || Random_name.length > 16)
        return res.json({success: false , message : 'Nickname is to long or to short.'});

    let token = playerAuth.addPlayer(Random_name, room_ID, player_ID);
    let decode = jwt.verify(token, "LUDOToken")
    // console.log('====================================');
    // console.log("Token_info", decode);
    // console.log('====================================');
    res.json({
        success: true,
        playerId: playerAuth.getPlayerId(Random_name),
        token: token,
        roomstatus: room_ID
    });

    console.log("Player " + Random_name + " joined lobby.")

    io.emit('lobby', "");

});
    
router.get('/admin_view_game/:g_id?/:id?', (req,res)=>{

    let room_id = req.params.g_id;
    let game_id = req.params.id;
  // res.render('adminViewGame',{baseUrl :__dirname});
   res.render('adminViewGame',{"baseUrlFullPath" :config.baseUrlFullPath,"baseUrl":config.baseUrl,room_id,game_id});
  });
 
  router.get('/game_list_view', (req,res)=>{
    res.render('game_list',{"baseUrlFullPath" :config.baseUrlFullPath,"baseUrl":config.baseUrl});
   });
 

router.get('/public/:par1?',function(req,res){
          let par1 = req.params.par1;
          let full_path = path.join(__dirname+`/public/${par1}`);
    return   res.sendFile(full_path); });

  
    router.get('/public/:par1?/:img?',function(req,res){
        let par1 = req.params.par1;
        let img = req.params.img;
        let full_path = path.join(__dirname+`/public/${par1}/${img}`);
        return   res.sendFile(full_path); });
    
              


router.use('/rest/players', function (req, res, next) {
    playerAuth.auth(req, res, next);
});

router.delete('/rest/player', function (req, res) {
    playerAuth[player] = null;
    io.emit('lobby', "");
});

router.use('/rest/active', function (req, res, next) {
    playerAuth.auth(req, res, next);
});

router.post('/rest/active', function (req, res) {
    playerAuth.playerActive(req.decoded.playerId);
    res.send("ok");
});  

router.post('/rest/playerExists', function (req, res) {
    let Random_name = (Math.random() + 1).toString(36).substring(7);

    if (playerAuth.playerExists(Random_name)) {
        res.json({
            success: false,
            message: 'Nickname is already in use.'
        });
    } else {
        res.json({
            success: true,
            message: 'Nickname free.',
        });
    }
});

router.get('/rest/login', function (req, res) {
    playerAuth.auth(req, res, function () {
        res.json({'valid': true})   
    });
});
    
 router.get('/jk', GameController.upGameData ); 

 router.post('/add_dish_num', GameController.add_dish_num ); 
 router.post('/set_dish_num', GameController.set_dish_num ); 

 router.post('/getGameData/:inner_game_id?/:c_game_id?', GameController.getGameData ); 
 router.get('/game_list', GameController.game_list ); 
router.get("/game_list_react", GameController.game_list_react)

     playerAuth.setLobbyCallback(function () {
              io.emit('lobby', ""); });

var tbl_game_data = '';   
      

async function startGame(players, idleTimeout, colors) {
    console.log("=========Players_Players", players)

    let room_players = [];
    room_players.push(players);
    let final = [];
    let super_final = []

    // for (i = 0; i <= players.length ; i++) {
    //     for (let j = i + 1; j <= players.length - 1; j++) {
    //         if (players[i].RoomID == players[j].RoomID) {
    //             final.push(players[i])
    //             final.push(players[j])
    //         }
    //     }
    // }



    //------------------------------------------------------------------------------------
    let find = await rooms_Model.find().sort({ playerID: -1 });

    console.log(">>>>>>>>>=================....................>>>>>>>>>find[find.length-1]", find)

    for (i = 0; i <= find.length; i++) {
        for (let j = i + 1; j <= find.length - 1; j++) {
            if (find[i].RoomID === find[j].RoomID) {
                final.push(find[i])
                final.push(find[j])
            }
        }
    }









    if (final.length < 2) return;

    let newPlayers = [];

    while (final.length > 0) {
        let index = Math.floor(Math.random() * (final.length));
        newPlayers.push(final[index]);
        final.splice(index, 1);
    }



    //let playerID = localStorage.getItem("playerId")
    //let game_color = localStorage.getItem("color")
 
    console.log("=================>>>>>>>>>>>>>>>>>>>======================>>>>>>>>>>>>>>>>>>>>+=================>>>>>>>>>>", newPlayers)

    let sort = newPlayers.sort((c1, c2) => {

        if (c1.playerId < c2.playerId) {
            return -1;
        } else {
            return 1;
        }
    })

    console.log("========>>>>>>>>========>>>>>>>========>>>>>>>>======+=l.>>>>>>>>>>>>>>>>>>>>>>>11111111111SORTING", sort)

    final = sort; 



    var colors = {
         playerID : 0,
         color : "yellow"
        }

    setTimeout(async () => {
        for (let i of sort) {
            let find_and_delete = await rooms_Model.findOneAndDelete({ RoomID: i.RoomID })
        }
    }, 30000);


    let game = gameJS.createGame(sort, idleTimeout, colors);



    console.log(">>>>>>>>>=================....................>>>>>>>>>find[find.length-1]", game)



    for (let i = 0; i < players.length; i++) {
        playerAuth.setIngame(players[i].playerId, true);
        playerAuth.setReady(players[i].playerId, false);
        playerAuth.setInLobby(players[i].playerId, false);
    }

    games.push(game);
     // tbl_game_data = await add_game(game);
      
        tbl_game_data  = await add_game(game);  

      // console.log( 'leeeeeeeee == ', tbl_game_data);

   //   console.log("============================================>>>>>>>>>>>>>>>>>>>>>>>>", game)

    gamesObserver.push(jsonpatch.observe(game));

    console.log("Starting game id: " + game.gameId);

    let string = game.gameId;
    for (let i = 0; i < players.length; i++) string += " " + players[i].playerId;
    setTimeout(function () {
        io.emit('gamestart', string);
    }, 200);

    //players = []

   // console.log("===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS===PLAYERS", players)
}                     
var i = 1;

 async function myCallback(gameId){
           
                      let ss = await getDataById(tbl_game_data._id.toString());
                     if(ss){ tbl_game_data = ss ;
                           let dff = JSON.stringify(jsonpatch.generate(gamesObserver[gameId]));      
                        console.log("ffffffff == ",dff);

                    io.emit('update',  gameId + " " + JSON.stringify(jsonpatch.generate(gamesObserver[gameId])));
                 
                 
                    // console.log(`${i} == myCallback call data is === `,ss );
                      
                     // io.emit('update',  gameId + " " + JSON.stringify(tbl_game_data['play_game']));
             
                    }else{
                       // console.log(`${i} == myCallback call data not updated  === `, ss );
                    }
                
                    //  console.log("set time out fun call == ", ss); 
                  

           
            i++;
                 
}

io.on('getPlayerData', (data) => {
    console.log('getPlayerData >>', data);
  })
     

async function sendUpdate(gameId,myCallback) {
      games[gameId].version++;
       let  ddd = 0;    
    
       ddd =  await update_game(gamesObserver[gameId],tbl_game_data._id.toString() ); 
          
             //  setTimeout( async function(){
            //           let ss = await getDataById(tbl_game_data._id.toString());
            //          if(ss){ tbl_game_data = ss ; }
            //         console.log("set time out fun call == ", ss); 
            //         },2000); 

        // console.log(`${i} == sendUpdate server data is === `,ddd );
        // i++;
        // io.emit('update',  gameId + " " + JSON.stringify(jsonpatch.generate(gamesObserver[gameId])));
        myCallback(gameId);
}

   
