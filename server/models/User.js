import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 }
})

// Hash Password Before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();

})

const User = mongoose.model("User", userSchema);
export default User;



// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // ==========================
// // User Schema Definition
// // ==========================
// const userSchema = new mongoose.Schema({
//   // User's full name
//   name: { type: String, required: true },

//   // Email must be unique (used for login)
//   email: { type: String, required: true, unique: true },

//   // Password will be hashed before saving
//   password: { type: String, required: true },

//   // Credits (default = 20) for using the app’s features
//   credits: { type: Number, default: 20 },
// });

// // ==========================
// // Pre-save Hook to Hash Password
// // ==========================
// // Runs automatically before saving user document
// userSchema.pre("save", async function (next) {
//   // If password is not modified, skip hashing
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     // Generate salt (10 rounds) and hash the password
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // ==========================
// // Compare Password Method
// // ==========================
// // Custom method for checking login password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // ==========================
// // Export Model
// // ==========================
// const User = mongoose.model("User", userSchema);
// export default User;


