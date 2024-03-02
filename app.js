import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"
import {Campground} from "./models/campground.js"

const app = express()
const PORT = 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'views'))



async function main() {
  try{
     await mongoose.connect('mongodb://127.0.0.1:27017/camp-finder');
     console.log("connected to database")
  }
  catch(err){
    console.log("MONGO CONNECTION ERR", err)
  }
}
main()

app.get("/", (req,res)=>{
  res.render("home")
})

app.get("/makecampground", async(req,res)=>{
  const camp = new Campground({title:"My Backyard", description:"cheap camping"})
  await camp.save()
  res.send(camp)
})

app.listen(PORT, ()=>{
  console.log(`App is running on port ${PORT}`)
})
