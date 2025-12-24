const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    title: { type: String, default: "" },       // ADD THIS
    price: { type: Number, default: 0 },        // ADD THIS
    quantityLeft: { type: Number, default: 10 },// OPTIONAL: for stock
    likes: { type: Number, default: 0 },
    comments: [
      { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String, createdAt: { type: Date, default: Date.now } }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);