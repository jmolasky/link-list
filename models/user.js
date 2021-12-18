const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { 
            type: String, 
            required: [true, 'Email Required'], 
            unique: true,
            index: true
        },
        password: { 
            type: String, 
            required: [true, "Password Required"],
            select: false
        },
    },
    { timestamps: true }
);

userSchema.plugin(uniqueValidator, {message: 'is already taken'});

module.exports = mongoose.model("User", userSchema);