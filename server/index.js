const express = require('express');
const bodyParser = require('body-parser');

const admin = require('firebase-admin');
const serviceAccount = require('./secrets/serviceAccountKey.json');
const cors = require('cors');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    })

//set up cors for localhost:3000 and localhost:5371



 
const app = express();
const port = 3000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5173'  ],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

    app.post('/add-claim', (req, res) => {
        console.log("Request received")
        const idToken = req.body.idToken;
        admin.auth().verifyIdToken(idToken).then(
            (decodedToken) => {
                const uid = decodedToken.uid;
                const claims = {
                    profileType: req.body.profileType
                };
                admin.auth().setCustomUserClaims(uid, claims).then(() => {
                    res.json({ message: "Claim added" });
                    console.log("Claim added after verification of token");
                }).catch((error) => {
                    res.json({ message: "Error adding claim" });
                })
            }
        ).catch((error) => {
            res.json({ message: "Error verifying token" });
        }
        )
    });
    

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});



