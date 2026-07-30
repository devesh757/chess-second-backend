"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../db/userModel"));
const zod_1 = __importDefault(require("zod"));
const user = (0, express_1.Router)();
user.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const usermodel = zod_1.default.object({
            firstname: zod_1.default.string().min(4).max(20),
            lastname: zod_1.default.string().min(4).max(20),
            email: zod_1.default.string().min(6).max(40).email(),
            password: zod_1.default.string().min(6).max(16)
        });
        const user = usermodel.safeParse(body);
        if (!user.success) {
            return res.status(403).json({
                message: "Invalid format",
                success: false
            });
        }
        const existinguser = await userModel_1.default.findOne({ email: user.data.email });
        if (existinguser) {
            return res.status(404).json({
                message: "Username already exists",
                success: false
            });
        }
        const hashedpassword = await bcrypt_1.default.hash(user.data.password, 10);
        const userparse = new userModel_1.default({
            firstname: user.data.firstname,
            lastname: user.data.lastname,
            email: user.data.email,
            password: hashedpassword
        });
        await userparse.save();
        const token = jsonwebtoken_1.default.sign({
            userId: userparse._id
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({
            message: "you are successfully signedup",
            token: token,
            success: true
        });
    }
    catch (e) {
        res.status(500).json({
            message: "internal server error",
            success: false
        });
    }
});
user.post("/signin", async (req, res) => {
    try {
        const body = req.body;
        const usermodel = zod_1.default.object({
            email: zod_1.default.string().min(6).max(40).email(),
            password: zod_1.default.string().min(6).max(16)
        });
        const user = usermodel.safeParse(body);
        if (!user.success) {
            return res.status(403).json({
                message: "Invalid format",
                success: false
            });
        }
        const existinguser = await userModel_1.default.findOne({ email: user.data.email });
        if (!existinguser) {
            return res.status(404).json({
                message: "Invalid Username and Password",
                success: false
            });
        }
        const isvalidPassword = await bcrypt_1.default.compare(user.data.password, existinguser.password);
        if (!isvalidPassword) {
            return res.status(401).json({
                message: "Invalid Credentials",
                success: false
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: existinguser._id
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            message: "you are successfully signin",
            token: token,
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
});
exports.default = user;
//# sourceMappingURL=auth.js.map