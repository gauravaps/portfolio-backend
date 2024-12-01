const { generateToken } = require("../middileware/generateToken");
const QueryModel = require("../models/mongo");
const bcrypt =require('bcryptjs');



exports.sendQuery = async (req, res) => {
    try {

        

        const { name, email,password, phone, msg } = req.body;
        const newQuery = new QueryModel({ name, email,password, phone, msg });
        const savedQuery = await newQuery.save();
            
        res.status(201).json(savedQuery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const adminUser = await QueryModel.findOne({ email, admin: true });
        if (!adminUser) {
            return res.status(404).json({ message: "Unauthorized credentials." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // const token = await generateToken(adminUser._id, '7d');
        const token = await generateToken(adminUser, '7d');

       
      
       

         res.status(201).json({
                message: true,
                id: adminUser._id,
                name: adminUser.name,
                token: token,
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};