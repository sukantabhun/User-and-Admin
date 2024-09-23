const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// added this incase we want to link the two as shown in the front end table
function generateLargeRandomId() {
  return Math.floor(100000000 + Math.random() * 900000000);
}

mongoose
  .connect('mongodb+srv://sukantabhun:a466kalkaji@cluster0.rvwpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const AddressSchema = new mongoose.Schema({
  id: Number,
  address: String,
});

const User = mongoose.model("User", UserSchema);
const Address = mongoose.model("Address", AddressSchema);

app.post("/api/users", async (req, res) => {
  const { name, address } = req.body;
  const id = generateLargeRandomId()
  const newUser = new User({ id,name });
  const newAddress = new Address({ id,address });

  try {
    await newUser.save();
    await newAddress.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save user data" });
  }
});

app.get("/api/users-with-addresses", async (req, res) => {
    try {
        const users = await User.find({});
        const addresses = await Address.find({});
        
        const addressMap = {};
        addresses.forEach(address => {
            addressMap[address.id] = address; 
        });


        const usersWithAddresses = users.map(user => ({
            ...user.toObject(),
            address: addressMap[user.id] ? addressMap[user.id].address : "N/A"
        }));

        res.status(200).json(usersWithAddresses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users and addresses" });
    }
});


const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
