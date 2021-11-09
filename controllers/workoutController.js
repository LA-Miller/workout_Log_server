const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey. This is a practice route')
})

// LOG CREATE
router.post("/", validateJWT, async(req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

// GET ALL LOGS OF AN INDIVIDUAL USER
router.get("/", validateJWT, async(req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id:id
            }
        })
        res.status(200).json(userLogs);
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

// GET INDIVIDUAL LOG OF A USER
router.get("/:id", validateJWT, async(req, res) => {
    const { id } = req.params;
    try {
        const results = await LogModel.findAll({
            where: { id: id }
        })
        res.status(200).json(results);
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

// UPDATE LOG OF A USER
router.put("/:id", validateJWT, async(req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    }

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    }

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

// DELETE INDIVIDUAL LOG OF A USER
router.delete("/:id", validateJWT, async(req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        }

        await LogModel.destroy(query);
        res.status(200).json({ message: "Log entry removed" });
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;