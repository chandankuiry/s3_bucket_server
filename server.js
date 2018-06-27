var express = require('express');
var nodemailer = require('nodemailer');
var app = express();
var fs = require('fs');
var AWS = require('aws-sdk');
// here i used my mlab account for mongodb database
var mongoose = require("mongoose");
    mongoose.connect("mongodb://chandan:chandan1995@ds149335.mlab.com:49335/s3bucketdb");
//check connection  
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback) {
    console.log("Connection succeeded.");
});
//define mongodb schema 
var Schema = mongoose.Schema;
var dbSchema = new Schema({
     email: String,
     data: String,
});
var dbmodel = mongoose.model("dbcoll", dbSchema);


app.get('/', function(req, res, next){
    res.send('welcome to the S3 App');

});


app.get('/getData/:dataid', function(req, res, next){
    // download the file via aws s3 here
    

    var fileKey = req.param.dataid;
    console.log(fileKey)
    //s3 bucket seeting here i have defined the secret key and access key for aws
    AWS.config.update(
      {

        sslEnabled: true,
        accessKeyId: "you aws accessid ",
        secretAccessKey: "your aws secret",
        region: 'eu-west-1'
      }

    );
    var s3 = new AWS.S3();
    
    //here I have defined the bucket name of s3 bucket.
    var params = {Bucket: 'bucket_name of aws s3'};
    //code for get the list objects from the bucket
    s3.listObjects(params, function(err, data){
      var bucketContents = data.Contents;
      
      let i=fileKey
      var urlParams = {Bucket: 'bucket_name of aws s3', Key: bucketContents[i].Key};
        s3.getSignedUrl('getObject',urlParams, function(err, url){
          console.log('the url of the image is', url);
          //code for save the data in mlab mongodb database.
          var bucketData = new dbmodel({
            email: "receiver mail id",
            data:url
        });
        bucketData.save(function(error) {
             
            if (error) {
                 console.error(error);
              }
            else{
                console.log("Your data has been saved in database!");
            }
        });
        //code for sending mail.
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          // here in auth option you have to put the company mail and password
          auth: {
            user: 'your mail id',
            pass: 'mail password'
          }
        });
        //here in 'from' option you can put company mail
        var message = " Hi. My name is Chandan kuiry ";
        var mailOptions = {
            from: 'your mail id ',
            to: 'receiver mail id',
            subject: 'Sending Email from my mail id ',
            text: message,
            attachments: [
                {path: url}]
        };
        transporter.sendMail(mailOptions , function(err, response){
            if(err){
                console.log(err);
            } else {
                console.log('Message sent: ' );
            }
            transporter.close();
        });

        res.send('mail has been sent'+"  "+ url);
        
        });
        
    });
    

});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('S3 Proxy app listening at http://%s:%s', host, port);
});