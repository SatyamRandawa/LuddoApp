const rooms_Model = require("./models/Rooms_players")

module.exports = {

    addPlayer: function (playerName, room_ID, player_ID) {
        return addPlayer(playerName, room_ID, player_ID);
    },
    playerExists: function (playerName) {
        return playerExists(playerName);
    },
    authPlayer: function (playerId, token) {
        return authPlayer(playerId, token);
    },
    auth: function (req, res, next) {
        return auth(req, res, next);
    },
    players: function () {
        return players;
    },
    getLobbyPlayers: function () {
        return getLobbyPlayers();
    },
    getReadyPlayers: function () {
        return getReadyPlayers();
    },
    getPlayerId: function (playerName) {
        return getPlayerId(playerName);
    },
    getPlayerById: function (playerName) {
        return getPlayerById(playerName);
    },
    setIngame: function (playerId, ingame) {
        players[playerId].ingame = ingame;
    },
    setReady: function (playerId, ready) {
        players[playerId].ready = ready;
    },
    setInLobby: function (playerId, inLobby) {
        players[playerId].inLobby = inLobby;
    },
    setSpectating: function (playerId, spectating) {
        players[playerId].spectating = spectating;
    },
    setLobbyCallback: function (cb) {
        updateLobbyCallback = cb;
    },
    playerActive: function (playerId) {
        return playerActive(playerId);
    },
    addPlayerToLobby: function (playerId) {
        return addPlayerToLobby(playerId);
    },
    chatDOSCheck: function (playerId) {
        return chatDOSCheck(playerId);
    },

    set_Player_Zero: function () {
        return true
    }

};

var jwt = require('jsonwebtoken');
var config = require('./config');

var playersIncrement = 0;
var players = [];
var playerToken = [];
var updateLobbyCallback;
var chatMessagesRecentNum = [];




setInterval(function () {
    if (updateLobbyCallback) {
        let changes = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i].inLobby && new Date() - players[i].lastActiveLobby > config.lobbyTimeout) {
                players[i].inLobby = false;
                players[i].ready = false;
                changes = true;
                console.log("player: " + players[i].playerName + " is inactive. ");
            }
        }
        if (changes) updateLobbyCallback(players);
    }
}, config.lobbyTimeoutCheckInterval);

function auth(req, res, next) {
    var token = req.body.token || req.query.token;

    if (!token) {
        console.log("123321123321132321======213213223", "token not available")
        playersIncrement = 0;
    }

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.status(200).send({
                    redirect: config.baseUrl
                });

            } else {
                req.decoded = decoded;

                next();
            }
        });
    } else {
        playersIncrement = 0
        res.status(200).send({

            redirect: config.baseUrl
        });

    }
}

function playerActive(playerId) {
    players[playerId].lastActiveLobby = new Date();
    if (players[playerId].inLobby) return;
    players[playerId].inLobby = true;
    console.log("player: " + players[playerId].playerName + " is active. ");
    updateLobbyCallback(players);
}

function playerExists(playerName) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].playerName === playerName) return true;
    }
    return false;
}







  function addPlayer(playerName, room_ID , player_ID) {

    //let join_ID = req.body;
    console.log("======================================================================>>>>>>>>>>>>>>>>>>>>PPPPPPPPOIIIIIIIIIIIGG", playerName)
    console.log("======================================================================>>>>>>>>>>>>>>>>>>>>PPPPPPPPOIIIIIIIIIIIGG", room_ID)



    const payload = {
        playerName: playerName,
        playerId: player_ID,
        RoomID: room_ID
    };

    console.log("====>PLAYESR====>", players)

    players.push({
        playerId: player_ID,
        playerName: playerName,
        ingame: false,
        ready: false,
        spectating: false,
        inLobby: true,
        lastActiveLobby: new Date(),
        RoomID: room_ID
    });
    playersIncrement++;

    let obj = {
        playerId: player_ID,
        playerName: playerName,
        ingame: false,
        ready: false,
        spectating: false,
        inLobby: true,
        lastActiveLobby: new Date(),
        RoomID: room_ID
    }

    let create =  rooms_Model.create(obj)



    if (playersIncrement >= 2) {
        playersIncrement = 0
    }

    console.log(">>>===========================aaaaaaaaaaasssssssssssssssssdddddddddddddddddffffffffffffffffggggggggggg======>", payload)
    //let token12 = window.localStorage.getItem("token")
    //console.log("===========================aaaaaaaaaaasssssssssssssssssdddddddddddddddddffffffffffffffffggggggggggg======>", token12)

    var token =   jwt.sign(payload, config.secret, {
        expiresIn: "10 days"
    });

    playerToken.push(token);

    return token;
}

function addPlayerToLobby(playerId) {
    if (players[playerId].inLobby) return;
    players[playerId].inLobby = true;
    console.log("player: " + players[playerId].playerName + " is active. ");
    updateLobbyCallback(players);
}

function getLobbyPlayers() {
    let lobbyPlayers = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].inLobby) lobbyPlayers[lobbyPlayers.length] = players[i];
    }
    return lobbyPlayers;
}

function getReadyPlayers() {
    let readyPlayers = [];
    for (let i = 0; i < players.length; i++) {
        if (players[i].ready) readyPlayers[readyPlayers.length] = players[i];
    }
    return readyPlayers;
}

function authPlayer(req, res) {
    console.log(req.decoded);
    players[playerId].lastActiveLobby = new Date();
    return (playerToken[playerId] === token);
}

function getPlayerId(playerName) {
    for (let i = 0; i < players.length; i++) if (playerName === players[i].playerName) return players[i].playerId;
    return;
}

function getPlayerById(playerId) {
    return players[playerId];
}

function chatDOSCheck(playerId) {
    if (chatMessagesRecentNum[playerId] === undefined) chatMessagesRecentNum[playerId] = 0;

    if (chatMessagesRecentNum[playerId] === 0) {
        setTimeout(function () {
            chatMessagesRecentNum[playerId] = 0;
        }, 10000)
    }

    chatMessagesRecentNum[playerId]++;

    return chatMessagesRecentNum[playerId] > 3;
}