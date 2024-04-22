
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

const sampleName = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async() =>{
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random()*1000)
    const randomPrice = Math.floor(Math.random()*30) + 10
    const camp = 
    new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title:`${sampleName(descriptors)} ${sampleName(places)}`,
      image:'https://source.unsplash.com/collection/9046579', 
      description:' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex incidunt eum laborum, nihil harum ratione atque totam repellat tempore facilis id quisquam, quod natus unde error nisi exercitationem! Minus, sapiente.',
      price: randomPrice
    })
    await camp.save()
  }
}

seedDB().then(()=>{
  mongoose.connection.close()
})