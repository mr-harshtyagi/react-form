const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const {Buffer} =require("buffer")
const mongoose = require("mongoose");
const cors=require("cors");

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const app = express();
app.use(cors(corsOptions)) 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Initiating connection database
mongoose.connect("mongodb://localhost:27017/organisationDB", {
  useNewUrlParser: true,
});

//Organisation Schema
const organisationSchema = {
  id : String,
  public_key: String,
  private_key: String,
  details : Object,
  data:String,
  digital_signature: String,
  digital_certificate:String
};
const Organisation = mongoose.model("Organisation", organisationSchema);

//IDX keys Schema
const idxKeySchema = {
  id: String,
  public_key: String,
  private_key: String,
};
const Key = mongoose.model("Key", idxKeySchema);

// Master keys of Identrix to issue digital certificates to organisations

// to send back all organisations data to populate table
app.get("/organisations", function(req,res){
Organisation.find(function (err, foundOrganisations) {
  if (err) res.send(err);
  else {
    res.send(foundOrganisations);
  }
});
})

//generating a pair of keys for IDX and storing them in database
app.get("/generatenewidxkey", function(req,res){
  let { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });
  publicKey = publicKey.toString("base64")
  privateKey = privateKey.toString("base64");

   const newKey = new Key({
     id: randomId(4),
     public_key: publicKey,
     private_key: privateKey,
   });
   newKey.save();
   res.send("Key Generated and saved successfully")
})

//show all IDX keys
app.get("/showallidxkeys", function (req, res) {
  Key.find(function (err, foundKeys) {
    if (err) res.send(err);
    else {
      res.send(foundKeys);
    }
  });
});

// handling registeration request from an onboarding organisation 
app.post("/postdatatoserver",function (req, res) {
  const receivedData = req.body;
  
//generating key pair for organisation
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "top secret",
    },
  });
// Find a certain identrix key from database to sign organisation credentials
   Key.findOne({ id: "jm51" }, function (err, foundKey) {
     if (err) res.send(err);
     else {
       const idxPrivateKey = foundKey.private_key;
       // Buffer private key object from base64 encoding so that it can be used to sign data
       const privateKeyObject = crypto.createPrivateKey(idxPrivateKey);
       privateKeyObject.export({ format: "pem", type: "pkcs8" });

       // Creating digital signature of Organisation by Identrix
       const sign = crypto.createSign("SHA256");
       const data =JSON.stringify(receivedData);
       console.log(data);
       sign.update(data); // hashing data object to obtain digest
       sign.end();
       const signature = sign.sign(privateKeyObject).toString("base64"); //encrpyt with private key to get Digital signature
       // push organisation credentials to database

       const newOrganisation = new Organisation({
         id:randomId(10),
         public_key:publicKey,
         private_key:privateKey,
         details:receivedData,
         data:JSON.stringify(receivedData),
         digital_signature:signature,
         digital_certificate:"This is your digital certificate"
       });
       newOrganisation.save();
     }
   });
  res.send("Organisation created and Digitallly Signed with Private key "); 
});

// sending keys back to organisation
app.get("/findkeys/:uniqueId", function (req, res) {
  Organisation.findOne({id : req.params.uniqueId},function (err, foundOrganisation) {
    if (err) res.send(err);
    else {
      res.send(foundOrganisation);
    }
  });
});



// verify digital signature with id and signature input
app.post("/verifysignature", function (req, res) {
  let signature =(req.body.signature).toString("base64");
  let flag=0;
  signature= Buffer.from(signature,"base64")  // very very important to buffer our signature
  let id = req.body.id;
  let data="";
  Organisation.findOne({id : id},function (err, foundOrganisation) {
    if (err) res.send(err);
    else {
      if(foundOrganisation)
      data =foundOrganisation.data.toString();
      else
      flag=1;
      
    }
  });
  // Find IDX public key to verify signature
 Key.findOne({ id: "jm51" }, function (err, foundKey) {
     if (err) res.send(err);
     else {
       const idxPublicKey = foundKey.public_key;
       const publicKeyObject = crypto.createPublicKey(idxPublicKey);
       // Verify digital signature of Organisation
       const verify = crypto.createVerify('SHA256');
       verify.update(data);
       verify.end();
       const result =(verify.verify(publicKeyObject, signature));
       if(flag===0)
       res.send(result)
       else
       res.send("ID not found in the Database")
     }
  });
});



// sending certificate back to organisation
app.get("/findcertificate/:uniqueId", function (req, res) {
  Organisation.findOne({id : req.params.uniqueId},function (err, foundOrganisation) {
    if (err) res.send(err);
    else {
      res.send(foundOrganisation.digital_certificate);
    }
  });
});


// generate random userID
function randomId(length) {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
