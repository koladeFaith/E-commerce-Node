const mongoose = require('mongoose')
const { string } = require('yup')
const productSchema = new mongoose({
    title: String,
    description: String,
    id: string,
    name: string,
    author: String,
    category: String, // e.g., "Education"
    price: number,
    coverImage: String,
})
const productModel = mongoose.model("Product", productSchema)
module.exports(productModel)
