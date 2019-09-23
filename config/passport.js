var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});
passport.use(
 new GoogleStrategy(
  {
   clientID: "745879377205-gjmkk5rrfnnqtehsae85n23cuuqol4d5.apps.googleusercontent.com",
   clientSecret: "5atwjiXioTEwx2iov3b-ElQu",
   callbackURL: "http://localhost:3900/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   var userData = {
    email: profile.emails[0].value,
    name: profile.displayName,
    token: accessToken
   };
   done(null, userData);
  }
 )
);