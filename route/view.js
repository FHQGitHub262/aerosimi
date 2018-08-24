const app = require("express").Router()
const f117 = "/mesh/f117/C:/%CD%A8%EF%BF%BD%EF%BF%BD/%C4%A3%EF%BF%BD%EF%BF%BD/F117/3DMODEL/"

app.get("/", (req, res) => {
    res.sendfile("public/page/index.html")
})

app.get(`${f117}*`, (req, res) => {
    let filename = req.url.substring(f117.length, req.url.length)
    res.sendfile(`public/mesh/f117/${filename}`)
})

module.exports = app