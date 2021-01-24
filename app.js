

const express = require("express");


const app = express();
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));




app.get('/', function(req, res){
    res.render('UI');
});





app.listen(7000, function(){
    console.log("Server has started ...");
});