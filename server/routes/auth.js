const express = require('express');
const router = express.Router();

const { User } = require('../models/models.js');

module.exports = function (passport) {
  // Add Passport-related auth routes here, to the router!

  // POST Login page
  router.post(
    '/login',
    passport.authenticate("local", {
      successRedirect: "/login/success",
      failureRedirect: "/login/failure",
    })
  );

  router.get("/login/success", (req, res) => {
		res.json({ success: true, id: req.user._id});
		console.log("login success", req.user);
		return;
	});

	router.get("/login/failure", (req, res) => {
		res.json({ success: false, id: null });
		return;
	});

  // router.post("/login", passport.authenticate("local"), function(req, res) {
  //   if (req.user) {
  //     res.json({ success: true, user: req.user });
  //   } else {
  //     res.json({ success: false });
  //   }
  // });

  // Add unique email check
  const validateReq = async function (userData) {
    if (!userData.username) {
      return 'Please enter a username.';
    }
    if (!userData.password) {
      return 'Please enter a password.';
    }

    const user = await User.findOne({username: userData.username});
    if (user)
      return "User already exists";
  };

  // POST registration
  router.post('/signup', async function (req, res) {
    // validation step
    let error = await validateReq(req.body);
    if (error) {
      return res.json({ success: false, error: error});
    }

    let u = new User({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    });

    u.save(function (err, user) {
      if (err) {
        return res.json({ success: false, error: err, user: null});
      }
      console.log('Saved User: ', user);
      return res.json({ success: true, error: null, user: user})
    });
  });

  router.get('/logout', function (req, res) {
    req.logout();
    res.json({
			success: true,
			error: "",
		});
  });

  return router;
};
