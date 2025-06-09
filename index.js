const {faker} = require('@faker-js/faker');
const mysql = require('mysql2');
const path = require('path');
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    database:'delta_app',
    password:'Suman@75699',
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
    
 ];
}
 
//HOME ROUTE
app.get('/',(req,res)=>{
  let q = `SELECT count(*) FROM customer`;
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let count = (result[0]['count(*)']);
    res.render('home.ejs',{count});
  });
  } catch(err){
    console.log(err);
    res.send('Some Error in Database');
  }
 
});

//show users route
app.get('/users',(req,res)=>{
  let q = `SELECT * FROM customer`;
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
      // console.log(result);
      res.render('showusers.ejs',{users});
    });
  } catch(err){
    console.log(err);
    res.send('Some Error in Database');
  }
});

//EDIT ROUTE
app.get('/user/:id/edit',(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM customer WHERE id = '${id}'`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = (result[0]);
      res.render('edit.ejs',{user});
    });
  } catch(err){
    console.log(err);
    res.send('Some Error in Database');
  }
    
});

//UPDATE (DB) ROUTE
app.patch('/user/:id',(req,res)=>{
  let {id} = req.params;
  let {password : formPass, username : newUserName} = req.body;
  let q = `SELECT * FROM customer WHERE id = '${id}'`
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = (result[0]);
      if(formPass != user.password){
        res.send('Wrong Password');
      } else {
        let q2 = `UPDATE customer SET username = '${newUserName}' WHERE id = '${user.id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect('/users');
        });
      }
    });
  } catch(err){
    console.log(err);
    res.send('Some Error in Database');
  }
});

app.get('/user',(req,res)=>{
  res.render('addUser.ejs');
});

app.post('/user',(req,res)=>{
    let {username ,email, password } = req.body;
    let id = uuidv4();
    let arr = [id,username,email,password];
    let q = `INSERT INTO customer (id,username,email,password) VALUES (?,?,?,?)`;

  try{
        connection.query(q,arr,(err,result)=>{
        if(err) throw err;
        res.redirect('/users');
    });
  } catch(err){
    console.log(err);
    res.send('Some Error in Database');
  }
});

app.listen('8080',()=>{
    console.log('Server is listening to port : 8080');
});

// try{
//     connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// } catch(err){
//     console.log(err);
// }

// connection.end();


//INSERTING NEW DATA
// let q = 'INSERT INTO customer (id,username,email,password) VALUES ?';
// let data = [];
// for(let i = 1; i<=100; i++){
//   data.push(getRandomUser()); // 100 fake users info
// }


