const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const linkSchema = new Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        website: String,
        description: String,
        private: { type: Boolean, required: true },
    },
    { timestamps: true }

);

module.exports = mongoose.model("Link", linkSchema);