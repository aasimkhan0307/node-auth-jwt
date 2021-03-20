const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  const id = req.user._id; // we had set id in request
  //const user = User.findByOne({_id:id})
  res.json({
    posts: {
      id: id,
      title: "first post",
      desc: "post description",
    },
  });
});

module.exports = router;
