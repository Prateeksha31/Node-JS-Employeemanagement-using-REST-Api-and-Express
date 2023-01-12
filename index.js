const mysql= require('mysql');
const express =  require('express');
const bodyParser = require('body-parser')

var app= express();
app.use(bodyParser.json());


var mysqlConnection= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password : 'Prathi@31',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection succeded');
    else
        console.log('DB connection failed due to \n Error :  ' +JSON.stringify(err, undefined,2));
});

app.listen(3001,()=>console.log("Express server is running server 3001"));

//Get all employees
app.get('/employees',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employee',(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
})


//Get employee using ID
app.get('/employees/:id',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
})


//Delete an employee using ID
app.delete('/employees/:id',(req, res)=>{
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err){
            console.log('DELETE SUCCESSFULLY');
            res.send({status : 200, message : 'DELETE SUCCESSFULLY', data : {}});
        }else{
            console.log(err);
        }
    })
})

//InSert an employee
app.post('/employees',(req, res)=>{
    let emp =req.body;
    var sql= "SET @EmpID = ?; SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);";

    //mysqlConnection.query()
    mysqlConnection.query(sql,[emp.EmpID, emp.Name,emp.EmpCode, emp.Salary ],(err,rows,fields)=>{
        if(!err){
            console.log('INSERTED SUCCESSFULLY');
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send({status : 200, message : 'INSERTED SUCCESSFULLY', data : element[0].EmpID});
            });
        }else{
            console.log(err);
        }
    })
})

//IUPDATE an employee
app.put('/employees',(req, res)=>{
    let emp =req.body;
    var sql= "SET @EmpID = ?; SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpId, @Name, @EmpCode, @Salary);";

    mysqlConnection.query(sql,[emp.EmpID, emp.Name,emp.EmpCode, emp.Salary ],(err,rows,fields)=>{
        if(!err){            
            res.send({status : 200, message : 'UPDATED SUCCESSFULLY', data : {}});
        }else{
            console.log(err);
        }
    })
})