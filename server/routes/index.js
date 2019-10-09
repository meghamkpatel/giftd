const express = require("express");
const router = express.Router();

var { User, Gift } = require("../models/models");

router.use(function(req, res, next) {
  if (!req.user) {
    res.json({
      notAuthenticated: true
    });
  } else {
    return next();
  }
});

// Send keywords to backend to be parsed and somehow return 3 options
router.post("/findGift", async function(req, res) {
  // let newDoc = {
  //   owner: req.user._id,
  //   content: req.body.content,
  // }
  // if (req.body.title) {
  //   newDoc.title = req.body.title;
  // }
  // new Document(newDoc).save(function (err, doc) {
  //   if (err) res.json({ error: err })
  //   else {
  //     res.json({ success: true, id: doc._id })
  //   }
  // });
});

//get the 3 gift options with item uri, name, and link
router.get("/findGift", async function(req, res) {
  try {
    // let docs = await Document.find({ owner: req.user._id });
    // console.log("Userdocs FETCH: ", docs)
    // res.json(docs);
  } catch {
    // console.log("Error fetching user")
  }
});

//fetch in gift.js but route should create a new gift object assigned to the logged in user
router.post("/selectedgift", async function(req, res) {
  try {
    // let docs = await Document.find({ owner: req.user._id });
    // console.log("Userdocs FETCH: ", docs)
    // res.json(docs);
  } catch {
    // console.log("Error fetching user")
  }
});

//fetch in home.js and route gets the logged in users gifts by id
router.get("/users/:userId/gifts", function(req, res) {
  // console.log('userId:', req.params.userId);
  Gift.find({ sender: req.params.userId },
    (err, gifts) => {
      if (err) {
        console.log("json failure sent");
        res.json({ success: false, error: err, data: [] });
      }

      if (!err) {
        console.log("json success sent");
        res.json({ success: true, error: "", data: gifts });
      }
    });
});

// router.get("/users/:email/registry", function(req, res) {
//   console.log('userId:', req.params.email);
//   User.find({ email: req.params.email},
//   // Gift.find({},
//     (err, registry) => {
//       if (err) {
//         console.log("json failure sent");
//         res.json({ success: false, error: err, data: [] });
//       }
//
//       if (!err) {
//         console.log("json success sent");
//         res.json({ success: true, error: "", data: registry });
//       }
//     });
// });

module.exports = router;
