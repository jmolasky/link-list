const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema(
    {
        name: { type: String, required: true },
        links: [{ type: Schema.Types.ObjectId, ref: "Link" }],
        user:{ type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tag", tagSchema);