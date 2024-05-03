import express, { urlencoded } from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"
import { Campground } from "./models/campground.js"
import methodOverride from "method-override"
import ejsMate from "ejs-mate"
import { catchAsync } from "./utils/catchAsync.js"
import { ExpressError } from "./utils/ExpressError.js"
import { campgroundSchema } from "./schemas.js"

const app = express()
const PORT = 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.engine('ejs', ejsMate)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/camp-finder');
    console.log("connected to database")
  }
  catch (err) {
    console.log("MONGO CONNECTION ERR", err)
  }
}
main()

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render("campgrounds/index", { campgrounds })
})

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new")
})

const validateCampground = (req, res, next) =>{
  const result = campgroundSchema.validate(req.body)
  console.log (result.details)
  const {error} = result
  console.log (error)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {

  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)

}))



app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render("campgrounds/show", { campground })
})


app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render("campgrounds/edit", { campground })
})

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect("/campgrounds")
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = "Oh no something went wrong"
  res.status(statusCode).render('error', { err })
})

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
