const { Router } = require("express");
const Link = require("../models/Link");

const router = Router();

router.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });
    if(link) {
        link.clicks++;
        await link.save();
        return res.redirect(link.from)
    } 
    return res.status(404).json({message: 'Page did not found'});
  } catch (error) {
    res.status(500).json({ message: "Something goes wrong", error: error });
  }
});

module.exports = router;
