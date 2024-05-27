const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path")
const cors = require("cors");
const { send } = require("process");
const bodyParser = require('body-parser');
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://mohammadharounmamalo:O2WIoAnC1kCC2X3L@cluster0.2vlwnec.mongodb.net/e-commerce")

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port" + port)
    }else{
        console.log("Error " + error)
    }
})

app.get("/", (req, res) =>{
    res.send("Express App is Running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

//Creating Upload Endpoint for Images
app.use('/images',express.static('upload/images'))

app.post("/upload", upload.single('product'),(req,res) => {
    res.json({
        success: 1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating Products

const Product = mongoose.model("Product",{
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available:{
        type: Boolean,
        default: true
    }
})

//Add to Database [Adding a Product]
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;

    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product)
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//API for Deleting Products
app.post('/removeproduct', async (req,res) =>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Product Removed")
    res.json({
        success: true,
        name: req.body.name
    })
})

//API for getting all products
app.get('/allproducts', async (req,res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema for User Model
const Users = mongoose.model('Users',{
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,

    },
    cartData:{
        type: Object
    },
    date:{
        type: Date,
        default: Date.now
    }
})

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) =>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 100; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({success: true, token})

})

//Creating Endpoinnt for user login

app.post('/login', async (req,res) => {
    let user = await Users.findOne({email:req.body.email});

    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({success: true, token})
        }else{
            res.json({success: false, errors: "Wrong Password"})
        }
    }else{
        res.json({success: false, errors:"Wrong Email Id"})
    }

})

//Creating EndPoint for NewCollection Data
app.get('/newcollection', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collection Added");
    res.send(newcollection);
})

//Creating EndPoint for Popular Items [Need Improvement, whereas which item is most bought]
// app.get('/popular', async (req, res) =>{
//     let products = await Product.find({});
//     let populatItem = products.slice(0,4)
//     console.log("Popular in Women Fetched");
//     res.send(populatItem)
// })

//Creating MiddleWare to fetch user
const fetchUser = async (req,res,next) => {
    const token = req.header('auth-token');
    if (!token){
        res.status(401).send({errors: 'Please Authenticate Using Valid Token'})
    }else{
        try{
            const data = jwt.verify(token, `secret_ecom`);
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Error"})
        }
    }
}

//Creating Endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req,res) =>{
    let userData = await Users.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added To Cart")
})

//Creating Endpoint to remove product from cartdata
app.post('/removefromcart', fetchUser, async (req,res) =>{
    let userData = await Users.findOne({_id:req.user.id})
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed To Cart")
})

//Create Endpoint to get cartdata
app.post('/getcart', fetchUser, async (req,res) =>{
    console.log("Get Cart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);    
})

app.get('/topcategory', async (req, res) => {
    let users = await Users.find({});
    let productCounts = {};

    // Aggregate cart data
    users.forEach(user => {
        for (let productId in user.cartData) {
            if (productCounts[productId]) {
                productCounts[productId] += user.cartData[productId];
            } else {
                productCounts[productId] = user.cartData[productId];
            }
        }
    });

    // Map product IDs to categories and sum quantities per category
    let categoryCounts = {};
    for (let productId in productCounts) {
        let product = await Product.findOne({ id: productId });
        if (product) {
            if (categoryCounts[product.category]) {
                categoryCounts[product.category] += productCounts[productId];
            } else {
                categoryCounts[product.category] = productCounts[productId];
            }
        }
    }

    // Find the category with the highest count
    let topCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);

    res.json({ success: true, topCategory: topCategory });
});

app.get('/categoryquantities', async (req, res) => {
    let users = await Users.find({});
    let productCounts = {};

    
    users.forEach(user => {
        for (let productId in user.cartData) {
            if (productCounts[productId]) {
                productCounts[productId] += user.cartData[productId];
            } else {
                productCounts[productId] = user.cartData[productId];
            }
        }
    });

    // Map product IDs to categories and sum quantities per category
    let categoryCounts = {};
    for (let productId in productCounts) {
        let product = await Product.findOne({ id: productId });
        if (product) {
            if (categoryCounts[product.category]) {
                categoryCounts[product.category] += productCounts[productId];
            } else {
                categoryCounts[product.category] = productCounts[productId];
            }
        }
    }

    
    let response = [];
    for (let category in categoryCounts) {
        response.push({
            category: category,
            quantity: categoryCounts[category]
        });
    }

    res.json({ success: true, data: response });
});

app.get('/userregistrations', async (req, res) => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    let userRegistrations = [];

    for (let i = 0; i < 7; i++) {
        const startDate = new Date(currentDate);
        startDate.setUTCDate(startDate.getUTCDate() - i);

        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        let userCount = await Users.countDocuments({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        userRegistrations.push({
            date: startDate.toISOString().split('T')[0],
            userCount
        });
    }

    res.json({ success: true, data: userRegistrations.reverse() });
});

app.get('/topproducts', async (req, res) => {
    try {
        let users = await Users.find({});
        let productCounts = {};

        
        users.forEach(user => {
            for (let productId in user.cartData) {
                if (productCounts[productId]) {
                    productCounts[productId] += user.cartData[productId];
                } else {
                    productCounts[productId] = user.cartData[productId];
                }
            }
        });

       
        let sortedProducts = Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3); 

        
        let topProducts = [];
        for (let [productId, count] of sortedProducts) {
            let product = await Product.findOne({ id: productId });
            if (product) {
                topProducts.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    count: count,
                    image: product.image
                });
            }
        }

        res.json({ success: true, data: topProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});





