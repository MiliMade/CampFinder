import express from "express"

const app = express()
const PORT = 8080
app.listen(PORT, ()=>{
  console.log(`App is running on port ${PORT}`)
})


app.get("/", (req,res)=>{
  res.send("Hello from your server!")
})