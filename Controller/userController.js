const express = require('express');

const {isEmpty} = require('../helper/game_fun_helper')

const user=require('../models/user');
const players_Model = require("../models/Rooms_players")

class userController {

  static user_register = async (req,res)=>{
    try{
      let name = req.body.name;
      let email = req.body.email;
      let password = req.body.password;
      let mobile = req.body.mobile;
      let image = req.files.image==''||req.files.image==undefined ? '' : req.files.image[0].filename;
      let gender = req.body.gender;
      let address = req.body.address;
      let details={name,email,password,image,mobile,gender,address}
      if(!isEmpty(name)||!isEmpty(email)||!isEmpty(password)||!isEmpty(mobile)){
        //console.log(details)
         let obj=new user(details);
         let data=await obj.save();
         return res.status(200).send({status:true,msg:"success"});

      }else{
        return res.status(200).send({status:false,msg:"all field required"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
    
  }

  static updateUser = async (req,res)=>{
    try{
      let id=req.params.id;
      let name = req.body.name;
      let email = req.body.email;
      let password = req.body.password;
      let mobile = req.body.mobile;
      let gender = req.body.gender;
      let address = req.body.address;
      let create_User = req.body.create_User;
      let details={};
      if(!isEmpty(name)){details={...details,name}};
      if(!isEmpty(email)){details={...details,email}};
      if(!isEmpty(password)){details={...details,password}};
      if(!isEmpty(mobile)){details={...details,mobile}};
      if(!isEmpty(gender)){details={...details,gender}};
      if(!isEmpty(address)){details={...details,address}};
      if(!isEmpty(create_User)){details={...details,create_User}};
      if(!isEmpty(id)){
        let update=await user.findOneAndUpdate({_id:id},details,{new:true})
      return res.status(200).send({status:true,msg:"success","body":update});

      }else{
        return res.status(200).send({status:false,msg:"all field required"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
    
  }

  static viewUser = async (req,res)=>{
    try{
      let _id=req.params.id;
      let whr={};
      if(!isEmpty(_id)){whr={...whr,_id}}
      let data=await user.find(whr);
      return res.status(200).send({status:true,msg:"success",body:data})
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"})
    }
  }

  static deleteUser = async (req,res)=>{
    try{
      let id=req.params.id;
      let data=await user.findByIdAndDelete(id);
      return res.status(200).send({status:true,msg:"success",body:data})
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"})
    }
  }

  static User_login = async (req,res)=>{
    try{
      let email=req.body.email;
      let pass = req.body.password;
      let data=await user.findOne({email});
      if(!isEmpty(data)){
        if(data.password==pass){
          return res.status(200).send({status:true,msg:"success",body:data});  
        }else{
          return res.status(200).send({status:false,msg:"invalid password"});
        }
      }else{
        return res.status(200).send({status:false,msg:"invalid email"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
  }

  static User_changepassword = async (req,res)=>{
    try{
      let email=req.body.email;
      let old_password = req.body.old_password;
      let new_password = req.body.new_password;
      let confirm_password = req.body.confirm_password;
      let data=await user.findOne({email});
      if(!isEmpty(data)){
        if(data.password==old_password){
          if(new_password==confirm_password){
            let data=await User.findOneAndUpdate({email},{password:new_password});
            return res.status(200).send({status:true,msg:"Password Changed",body:data});  

          }else{
            return res.status(200).send({status:false,msg:"new and confirm password mismatch"});  
          }
        }else{
          return res.status(200).send({status:false,msg:"invalid password"});
        }
      }else{
        return res.status(200).send({status:false,msg:"invalid email"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
  }




  static user_view = async (req, res) => {

    try {

      let find = await players_Model.find().sort("")

      return res

    } catch (error) {
      console.log(error)
      return res.status(200).send({ status: false, msg: "server error" })
    }

  }


}

module.exports=userController;

