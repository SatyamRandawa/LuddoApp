

const {getcurntDate,update_game,getDishNum } = require('../helper/game_fun_helper');

const admin_dish_sets_tbl = require('../models/admin_dish_sets');
const gameData_tbl = require('../models/gameData');


class GameController{

   static upGameData = async(req,res)=>{
        let id = req.body.id;       
        let updata = req.body.updata;       
        let data11 = await getDishNum();
           console.log( "getDishNum == ",data11); 
           return res.status(200).json({"msg": 'user not found',"status": true,"details": data11});
      }
      static getGameData = async(req,res)=>{
        try {
                    let inner_game_id = req.params.inner_game_id;  
                    let c_game_id = req.params.c_game_id;  
                   // let data = await gameData_tbl.find({_id: "6385b170917821b6c863cad1"});
                    
                    let data = await gameData_tbl.find({_id: c_game_id }).sort({_id:-1});
                if(data){
                    return res.status(200).json({"msg": 'success',"status": true,"details": data});
                }else{
                    return res.status(200).json({"msg": 'user not found',"status": false,"details": ''});
                }          

      } catch (error) {  console.log(error); 
           return res.status(200).json({"msg": 'user not found',"status": false,"details": ''});
                     }
      }
    
      static game_list = async(req,res)=>{
        try {
              let date = getcurntDate();   
               
             let data = await gameData_tbl.find({date:{ $gte: date}}).sort({_id:-1});
             //console.log(data); 
                if(data){
                    return res.status(200).json({"msg": 'success',"status": true,"details": data});
                }else{
                    return res.status(200).json({"msg": 'No Data Found!..',"status": false,"details": ''});
                }          

      } catch (error) {  console.log(error); 
           return res.status(200).json({"msg": 'user not found',"status": false,"details": ''});
                     }
      }

    static game_list_react = async (req, res) => {
        try {

            let date = getcurntDate();

            console.log("Date=======================================>>>>>", date)
            let data = await gameData_tbl.find({ createdAt: { $gte: date } }).sort({ _id: -1 });
            let result = []
            data.map((item, index) => {
                let g_id = item.play_game.object.gameId;
                let urls = `/admin_view_game/${g_id}/${item._id}`;
                let p_name = "";
                let g_time = item.createdAt;
                item.play_game.object.players.map((p) => {
                    p_name += `${p.playerName} `;
                })
                let m_ul = `${p_name}`;
                console.log("123", m_ul)

                let obj = {
                    gameID: g_id,
                    Player_ID: item._id,
                    player_name: (p_name != '') ? m_ul : '',
                    Url: `http://localhost:8080${urls}`,
                    game_time: g_time,
                }
                result.push(obj)
            })

            return res.status(200).json({ msg: result });

        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: error.message, "msg": 'user not found', "status": false, "details": '' });

        }
    }



   static  add_dish_num = async(req,res)=>{
    try {
            let dish_num = req.body.dish_num;

            if(!dish_num>0 || dish_num >= 7 ){
                return res.status(200).json({"msg": 'Invalid Dish Number',"status": false,"details": ''});     
            }
        let dd = new admin_dish_sets_tbl({"admin_status":1,"dish_num": dish_num });     
        let data = await dd.save(); 
          
        if(data){
                   return res.status(200).json({"msg": 'data add successfull',"status": true,"details": data});
                }else{
                    return res.status(200).json({"msg": 'user not found',"status": false,"details": ''});
                }

    } catch (error) { console.log("SERVER ERROR", error); return false;}
     
        }

        static  set_dish_num = async(req,res)=>{
            try {
                    let dish_num = req.body.point_num;
                    let game_id = req.body.game_id;
                    let room_id = req.body.room_id;
   
                    console.log("html page get data ==  ",req.body);
        
                    if(!dish_num>0 || dish_num >= 7 ){
                        return res.status(200).json({"msg": 'Invalid Dish Number',"status": false,"details": ''});     
                    } 
               
              
                admin_dish_sets_tbl.findOneAndUpdate({_id:'6380bccf116b2e92b820904b'},{$set : {"admin_status":true,"dish_num": dish_num,"game_id":room_id}},{new: true},
                (err, updatedUser) => {
              if(err) {  console.log( "error fun  ", err); return res.status(200).json({"msg": 'user not found',"status": false,"details": ''});  }else{ 
                        return res.status(200).json({"msg": 'data add successfull',"status": true,"details": updatedUser});
                            }

                 } );  
     
            } catch (error) { console.log("SERVER ERROR", error); return false;}
             
                }





}

module.exports = GameController;