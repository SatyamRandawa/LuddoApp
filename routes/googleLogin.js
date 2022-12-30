const express = require('express');
const router = express.Router();
let app = express();
let user_Model = require("../models/user")

const cookieSession = require('cookie-session')
const { session } = require('passport');

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth2').Strategy



passport.use(new GoogleStrategy({
    clientID: '42271595258-one5papoh5rg8enfo79uchtdqkqc6c9g.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8080/google/callback',
    passReqToCallback: true
}, 

async function (request,response, accessToken, refreshToken, profile, done) {
    //let find_cust = await user_Model.find({email : profile.email})
   
        let find_cust = await user_Model.find({email : profile.email})

        if(find_cust){ 
           console.log("Login_successfully")
           localStorage.setItem("User", "Login")
           return({status : true, msg:"Login Sucessfully", find_cust})
        }
    
   
    if(find_cust.length){

        console.log("register")

    }else{

        let obj = {
            name : profile.displayName,
            email : profile.email,
            password : profile.id,
            mobile : "",
            image : profile.picture,
            gender : "",
            address : "",
            google_token : accessToken
        }

        let create_data = await user_Model.create(obj)

        if(create_data){
            console.log(create_data)
        }

        console.log("user_data ======>",obj)

    }
    if ("============>",profile.displayName) {
        console.log("Token generated")
        console.log("Token generated",accessToken)
       
    }
    console.log("============>",profile.email)
    //return res.status(200).send({status:true, profile})
   // return done(null, profile)
}
));



passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});




app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}));


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}


router.use(passport.initialize());
router.use(passport.session());


router.get('/', (req, res) => res.render('pages/index'));
router.get('/failed', (req, res) => res.send('You Failed to log in!'));


router.get('/good', isLoggedIn, (req, res) => {
    res.render("pages/profile", { name: req.user.displayName, pic: req.user.photos[0].value, email: req.user.emails[0].value })
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }),
    //console.log(scope)
          
);


router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {

    
        res.redirect('/good');
    }
);

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


module.exports = router