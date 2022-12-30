const gameData_tbl = require('../models/gameData');
const admin_dish_sets_tbl = require('../models/admin_dish_sets');


const getcurntDate = () =>{
  let date = new Date();
var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }
        //return dd + '/' + mm + '/' + yyyy;
             return yyyy + '-' + mm + '-' +dd ;


}  
const isEmpty = (value) => (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
  const isArray = function(a) {
    return (!!a) && (a.constructor === Array);
  };
  
  const isObject = function(a) {
    return (!!a) && (a.constructor === Object);
  };





const  add_game = async(data)=>{
    try {
        let dd = new gameData_tbl({"play_game":data});     
        let res = await dd.save();   
       return (res)? res : false; 

    } catch (error) { console.log("SERVER ERROR", error); return false;}
     
}


const getDataById = async(id)=>{
        let data = await gameData_tbl.find({"_id":id});
            return (data)? data[0]: false;
      }
var tt = 1;
const getDishNum = async(id)=>{
  try {
       let data = await admin_dish_sets_tbl.find({"admin_status":1,"game_id":id});
        if(! isEmpty(data)){
                console.log ( "git dishNum fun call times == ",tt);
                tt++; 
               admin_dish_sets_tbl.findOneAndUpdate({_id:data[0]._id},{$set : {"admin_status":false,"game_id":50  }},{new: true},
                     (err, updatedUser) => {
                if(err) {  console.log( "error fun  ", err); }  

                      } );
             return  data[0]['dish_num'] ;
        }else{  return false; }
      } catch (error) { return false; }   

}

const  update_game = (data,id)=>{
    try {
        
            let newId = id;
           console.log("helper fun calls id == ", newId );     
          // console.log("helper fun calls data == ", data );     


/////////////////////////////////
  gameData_tbl.findOneAndUpdate({_id: id},{$set : {"play_game":data} },{new: true}, (err, updatedUser) => {
                            if(err) {  console.log( "error fun  ", err); return false;  }
                                  
                            if(!isEmpty(updatedUser)){ 
                                // console.log('fun suuusss ==',updatedUser);  
                                  return updatedUser;
                                         }else{   console.log('invalid id');   return false; } 
                               
                                        } );
                             

    
//////////////////////////////////////

    } catch (error) { console.log("SERVER ERROR", error); return false;}
     
}



module.exports = {isEmpty,getcurntDate,add_game,update_game,getDataById,getDishNum};
















