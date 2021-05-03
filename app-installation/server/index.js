const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

//hashing des MP
const bcrypt = require('bcrypt')
const saltRounds =10

const app = express();

app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "reactloginsystem",
});

app.get("/", (req, res) => {
  res.send("hello oooooooo");
});

app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;



    bcrypt.hash(password, saltRounds, (err, hash)=>{

      if(err){
        console.log(err)
      }

      db.query(
        "INSERT INTO users (username, password) VALUES (?,?)",
        [username, hash],
        (err, result) => {
          console.log(err);
        }
      );

    })


});

app.post('/login', (req, res)=>{
  const username = req.body.username;
    const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ? ; ",
    username,
    (err, result) => {

      if(err){
        res.send({err:err});
      }

      if(result.length > 0){
        bcrypt.compare(password, result[0].password, (error, response)=>{
          if(response){
            res.send(result)
          } else{
            res.send({message:'Erreur d\'identifiant ou de mot de passe'});
          }
        })
      } else{
        res.send({message:'Cet utilisateur n\'existe pas'})
      }
      console.log(err);
    }
  );
})

app.listen(3001, () => {
  console.log("run 3001");
});
