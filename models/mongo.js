const mongoose = require("mongoose");
const bcrypt =require('bcryptjs');

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, 
        },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // Email validation
        },

        password: {
            type: String,
            
            
        },

        phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Phone number must be 10 digits."], // Phone number validation
        },
        msg: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving to the database
collectionSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    // Hash the password only if it's new or modified and not empty
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 

    // If password is not provided, set a default password (hashed)
  } else if (!this.password) {
    
    this.password = null; 
  }
  next();
});


const QueryModel = mongoose.model("yourquery", collectionSchema);

module.exports = QueryModel;
