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

app.get("/campgrounds", async(req,res)=>{
  const campgrounds = await Campground.find({})
  res.render("campgrounds/index", {campgrounds})
})

app.get("/campgrounds/new", (req,res)=>{
  res.render("camgrounds/new")
})

app.get("/campgrounds/:id", async(req,res)=>{
  const campground = await Campground.findById(req.params.id)
  console.log(campground)
  res.render("campgrounds/show", {campground})
})

app.listen(PORT, ()=>{
  console.log(`App is running on port ${PORT}`)
})
