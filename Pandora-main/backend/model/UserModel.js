import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide Username"],
        trim: true,
        maxlength: [20, "UserName can not be longer than 20 characters"],
        match: [/^[a-zA-Z0-9_.]*$/, "Please provide a valid Username"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please provide Email"],
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide Password"],
        trim: true,
        minlength: [8, "Password cannot be lesser than 8 characters"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must have at least one uppercase letter, one lowercase letter, and one digit",
        ],
    },
    picture: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        required: [true, "Please provide Gender"],
        enum: ["male", "female"],
    },
});

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

UserSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

export default mongoose.model("User", UserSchema);
