//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));   //special command to add "public" folder our static components: images and css
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fName 
    const lastName = req.body.lName 
    const email = req.body.email 

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/615f0aa67d";
    const options = {
        method: "POST",
        auth: "erskine1:0e6dfde3861507545214d90b51ece4be-us17"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); 
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
   })

   request.write(jsonData);
   request.end();

});
// *** Home route redirection ***
app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {       ///process.env.PORT is to listen to heroku  ;  3000 is to local
    console.log("Server is running on port 3000");
});


//API Key     //https://us17.admin.mailchimp.com/account/api/
// 0e6dfde3861507545214d90b51ece4be-us17

// List ID    //https://us17.admin.mailchimp.com/lists/settings/defaults?id=1358029
// 615f0aa67d    


//commands use to update changes: $git
//1. $ git add .
//2. $ git commit -m "3rd commit"
//3. $ git push heroku main
