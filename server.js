const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const PORT=8001
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://mohammad:1234@cluster0-shard-00-00.vf9yl.mongodb.net:27017,cluster0-shard-00-01.vf9yl.mongodb.net:27017,cluster0-shard-00-02.vf9yl.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ruu2od-shard-0&authSource=admin&retryWrites=true&w=majority');
}
const fruitSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
  });
  const fruitModel = mongoose.model('fruit', fruitSchema);
  function getAll(req,res){
      axios.get('http://fruit-api-301.herokuapp.com/getFruit').then(result=>{
          res.send(result.data.fruits)
      })
  }
function add(req,res){
    const {name,image,price,email} = req.body;
    fruitModel.create({name:name,image:image,price:price,email:email})
}
function getFav(req,res){
    const email= req.query.email;
    fruitModel.find({email:email},(err,result)=>{
        if(err) {
            res.send(err);
        }else{
            res.send(result)
        }
    })
}
function deleteFav(req,res){
    const id=req.params.id;
    const email=req.query.email;
    fruitModel.deleteOne({_id:id},()=>{
        fruitModel.find({email:email},(err,result)=>{
            if(err) {
                res.send(err);
            }else{
                res.send(result)
            }
        })
    })
}
function update(req,res){
    const id=req.params.id;
    const{name,image,price,email}=req.body
    fruitModel.findByIdAndUpdate(id,{name,image,price},()=>{
        fruitModel.find({email:email},(err,result)=>{
            if(err) {
                res.send(err);
            }else{
                res.send(result)
            } 
        })
    })
}

server.get('/getAll',getAll)
server.post('/add',add)
server.get('/getFav',getFav)
server.delete('/delete/:id',deleteFav)
server.put('/update/:id',update)
server.listen(PORT, () => {
    console.log(`hello from :${PORT}`)
   })
