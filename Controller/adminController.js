const express = require('express');

const {isEmpty} = require('../helper/game_fun_helper')

const admin=require('../models/admin');

class adminController {

  static createAdmin = async (req,res)=>{
    try{
      let name = req.body.name;
      let email = req.body.email;
      let password = req.body.password;
      let mobile = req.body.mobile;
      let gender = req.body.gender;
      let address = req.body.address;
      let create_admin = req.body.create_admin;
      let details={name,email,password,mobile,gender,address,create_admin}
      if(!isEmpty(name)||!isEmpty(email)||!isEmpty(password)||!isEmpty(mobile)){
         let obj=new admin(details);
         let data=await obj.save();
         return res.status(200).send({status:true,msg:"success",body:data});

      }else{
        return res.status(200).send({status:false,msg:"all field required"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
    
  }

  static updateAdmin = async (req,res)=>{
    try{
      let id=req.params.id;
      let name = req.body.name;
      let email = req.body.email;
      let password = req.body.password;
      let mobile = req.body.mobile;
      let gender = req.body.gender;
      let address = req.body.address;
      let create_admin = req.body.create_admin;
      let details={};
      if(!isEmpty(name)){details={...details,name}};
      if(!isEmpty(email)){details={...details,email}};
      if(!isEmpty(password)){details={...details,password}};
      if(!isEmpty(mobile)){details={...details,mobile}};
      if(!isEmpty(gender)){details={...details,gender}};
      if(!isEmpty(address)){details={...details,address}};
      if(!isEmpty(create_admin)){details={...details,create_admin}};
      if(!isEmpty(id)){
        let update=await admin.findOneAndUpdate({_id:id},details,{new:true})
      return res.status(200).send({status:true,msg:"success","body":update});

      }else{
        return res.status(200).send({status:false,msg:"all field required"});
      }
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"});
    }
    
  }

  static viewAdmin = async (req,res)=>{
    try{
      let _id=req.params.id;
      let whr={};
      if(!isEmpty(_id)){whr={...whr,_id}}
      let data=await admin.find(whr);
      return res.status(200).send({status:true,msg:"success",body:data})
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"})
    }
  }

  static deleteAdmin = async (req,res)=>{
    try{
      let id=req.params.id;
      let data=await admin.findByIdAndDelete(id);
      return res.status(200).send({status:true,msg:"success",body:data})
    }catch (error){
      console.log(error);
      return res.status(200).send({status:false,msg:"server error"})
    }
  }

  static admin_login = async (req,res)=>{
    try{
      console.log("123")
      let email=req.body.email;
      let pass = req.body.password;
      let data=await admin.findOne({email});
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

  static admin_changepassword = async (req,res)=>{
    try{
      let email=req.body.email;
      let old_password = req.body.old_password;
      let new_password = req.body.new_password;
      let confirm_password = req.body.confirm_password;
      let data=await admin.findOne({email});
      if(!isEmpty(data)){
        if(data.password==old_password){
          if(new_password==confirm_password){
            let data=await admin.findOneAndUpdate({email},{password:new_password});
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

}

module.exports=adminController;

