
import mongoose from "mongoose"
import {Campground} from "../models/campground.js"
import { cities } from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";


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

const seedDB = async() =>{
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random()*1000)
    const camp = 
    new Campground({
      location: `${cities[random1000].city},${cities[random1000].state}`
    })
    await camp.save()
  }
}

seedDB()