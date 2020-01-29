const http = require('http');
const express = require('express');
const formidable = require('formidable');
const util = require('util');
const app = express();
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


var fs = require('fs');
const form =  new formidable.IncomingForm();

app.get('/upload',(req,res) =>{
    res.send("hello world");
    const visualRecognition = new VisualRecognitionV3({
        version: '2018-03-19',
        authenticator: new IamAuthenticator({ apikey: 'KvnVxXCjN81frRj5c3iJuCf1-nEyHPD6WVoy3deqEWqM' }),
      });
      const params = {
        imagesFile: fs.createReadStream('./3004.jpg')
      };
       
      visualRecognition.classify(params)
        .then(response => {
            console.log(JSON.stringify(response.result, null, 2));
        })
        .catch(err => {
          console.log(err);
        });
});

app.get('/',(req,res) =>{
    res.writeHead(200, { 'content-type': 'text/html' });
  res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post('/upload',(req,res) => {
    form.parse(req, (err, fields, files) => {
        var oldpath = files.upload.path;
        var images_file= fs.createReadStream(oldpath);
        var classifier_ids = ["DefaultCustomModel_742055041"];
        var threshold = 0.6;

        const params = {
            imagesFile: images_file,
            classifier_ids: classifier_ids,
            threshold: threshold
          };

        const visualRecognition = new VisualRecognitionV3({
            version: '2018-03-19',
            authenticator: new IamAuthenticator({ apikey: 'KvnVxXCjN81frRj5c3iJuCf1-nEyHPD6WVoy3deqEWqM' }),
          });
          
        visualRecognition.classify(params, function(err, response) {
            if (err) { 
              console.log(err);
            } else {
              res.setHeader("Access-Control-Allow-Origin","*");
              res.setHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS");
              res.send(JSON.stringify(response.result, null, 2));
            } 
          });

      });
  });


const port = process.env.PORT || 3000;
app.listen(port,() => {console.log(`listing...${port}`)});