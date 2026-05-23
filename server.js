const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const familyRoutes = require('./routes/familyRoutes');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/families', familyRoutes);


const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ email: 'admin@payyoli' });
        if (!adminExists) {
            const defaultAdmin = new Admin({
                email: 'admin@payyoli',
                password: 'admin123'
            });
            await defaultAdmin.save();
            console.log("Default admin account seeded successfully.");
        }
    } catch (err) {
        console.error("Error seeding admin:", err);
    }
};

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("MongoDB Connected");
    await seedAdmin();
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Payyoli Survey API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});