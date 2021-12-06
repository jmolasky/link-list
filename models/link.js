const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linkSchema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        user_id: { type: String, required: true },
        website: String,
        description: String,
        img: String,
        private: { type: Boolean, required: true },
    },
    { timestamps: true }

);

module.exports = mongoose.model("Link", linkSchema);