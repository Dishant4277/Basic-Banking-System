const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require('mongoose');
require("dotenv").config();


mongoose.set('strictQuery', true);

 mongoose.connect(process.env.MONGODB_URI,{
   useUnifiedTopology:true,
   useNewUrlParser:true});

  const app = express();

  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static("public"));

const customerSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true},
  accountNo:{
    type:Number,
    required:true},
  accountType:{
    type:String,
    required:true},
  email:{
    type:String,
    required:true},
  balance:{
    type:Number,
    required:true
  }
})

const Customer= new mongoose.model("customer",customerSchema);

const customer1 =new Customer({
  name:"Isha Dutt",
  accountNo: 216480,
  accountType:"Savings",
  email:"ishadutt4444@gmail.com",
  balance:500000
})
const customer2 =new Customer({
  name:"Ramesh Gupta",
  accountNo: 216481,
  accountType:"Savings",
  email:"rameshgupta@gmail.com",
  balance:150000
})
const customer3 =new Customer({
  name:"Anmol Nayyar",
  accountNo: 216482,
  accountType:"Savings",
  email:"anmolnayyar@gmail.com",
  balance:2250000
})
const customer4 =new Customer({
  name:"Vishal Verma",
  accountNo: 216483,
  accountType:"Savings",
  email:"vishal123@gmail.com",
  balance:5000000
})
const customer5 =new Customer({
  name:"Tanish Kumar",
  accountNo: 216484,
  accountType:"Savings",
  email:"Tanish456@gmail.com",
  balance:250000
})
const customer6 =new Customer({
  name:"Varun Sharma",
  accountNo: 216485,
  accountType:"Savings",
  email:"varun9999@gmail.com",
  balance:350000
})
const customer7 =new Customer({
  name:"Akhil Sharma",
  accountNo: 216486,
  accountType:"Savings",
  email:"aks39666@gmail.com",
  balance:5000000
})

const customer8 =new Customer({
  name:"Sangam Mahajan",
  accountNo: 216487,
  accountType:"Savings",
  email:"sangammj123@gmail.com",
  balance:950000
})
const customer9 =new Customer({
  name:"Nishant Bhagat",
  accountNo: 216488,
  accountType:"Savings",
  email:"nishant123@gmail.com",
  balance:500005
})
const customer10 =new Customer({
  name:"Zaffer Iqbal",
  accountNo: 216489,
  accountType:"Savings",
  email:"zaferiqbal5556@gmail.com",
  balance:1250000
})
const defaultCustomers=[customer1,customer2,customer3,customer4,customer5,customer6,customer7,customer8,customer9,customer10]

const transactionSchema=new mongoose.Schema({
  sName:String,
  rName:String,
  sAccount:Number,
  rAccount:Number,
  tAmount:Number,
  message:String
})
const Transaction = new mongoose.model("transaction",transactionSchema)

  app.get("/",function(req,res){
    res.render("home");
  })

  app.get("/about",function(req,res){
    res.render("about");
  })

  app.get("/contact",function(req,res){
    res.render("contact");
  })

  app.get("/transact",function(req,res){
    res.render("transact");
  })

  app.get("/success",function(req,res){
    res.render("success");
  })

  app.get("/failure",function(req,res){
    res.render("failure");
  })

  app.get("/history",function(req,res){
    Transaction.find({}).then(function(foundTransactions){
      res.render("history",{allTransactions:foundTransactions})
    }).catch(error => { console.log(error);})
  })

  app.get("/allcust",function(req,res){
    Customer.find({}).then(function(foundCustomers){
      if(!foundCustomers || foundCustomers.length===0){
        Customer.insertMany(defaultCustomers);
        res.redirect("/allcust");}else{
        res.render("allcust",{allcustomers:foundCustomers})}
    }).catch(error => { console.log(error);})
  })

  app.post("/transact",function(req,res){
    const senderName=req.body.senderName;
    const senderAccount=req.body.senderAccountNum;
    const recipientName=req.body.recipientName;
    const recipientAccount=req.body.recipientAccountNum;
    Customer.findOne({name:senderName , accountNo:senderAccount}).then(function(result){
      if(!result){
        console.log("error");
        res.render("failure");
      }else if(result.balance>=req.body.amount){
        Customer.findOne({name:recipientName , accountNo :recipientAccount}).then(function(result){
          if(!result){
            console.log("error");
              res.render("failure");
          }else{
          const newRBalance=parseInt(result.balance) + parseInt(req.body.amount);

            result.balance=newRBalance;
            result.save();
          }
        }).catch(error => { console.log(error);})
         const newSBalance=result.balance-req.body.amount;
        result.balance=newSBalance;
        result.save();
        const newTransaction= new Transaction({
          sName:senderName,
          rName:recipientName,
          sAccount:req.body.senderAccountNum,
          rAccount:req.body.recipientAccountNum,
          tAmount:req.body.amount,
          message:req.body.msg
        })
        newTransaction.save();
        res.render("success");
      }else{
        console.log("error");
        res.render("failure");
      }
    }).catch(error => { console.log(error);})
  })

  app.listen(process.env.PORT,function(){
    console.log("Server started at port 3000");
  })
