const bcryptjs = require('bcryptjs')
const crypto = require("crypto")
const User = require("../models/User.model.js")
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie.js');
const { verificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('../mailtrap/emails.js');

 

const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			console.log("All fields are required");
		}

		// check if user already exists
		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		// create a hash password and a verificationToken
		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		// create a user after the hash password and the email doesn't exists
		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();
 
		// jwt : JsonWebToken
		generateTokenAndSetCookie(res, user._id);

		//send verification email by mailtrap

		verificationEmail(user.email,verificationToken);

		// send respones to the server that the user is created successfully
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

	} catch (error) {
		res.status(400).json({ success: false, message: "please fill all fields" });
	}
};

const verifyEmail = async (req,res) => {
		// find the user with the verificationToken and verificationTokenExpiresAt in the user module if he exist
		const { code } = req.body;
		try {
			const user = await User.findOne({
				verificationToken: code,
				verificationTokenExpiresAt: { $gt: Date.now() },
			});
		    
			// if the user is inValid or has a expired verificationToken code it respondes with an error
			if (!user) {
				return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
			}
		    // after finding the user and see if he is valid and not expired it set hes isVerified to true in the user modlue
			user.isVerified = true;
			user.verificationToken = undefined;
			user.verificationTokenExpiresAt = undefined;
			await user.save();
			// after isVerified we dont both the verificationToken and the TokenExpiresAt so we set them to undefind

			await sendWelcomeEmail(user.email, user.name);
	
			res.status(200).json({
				success: true,
				message: "Email verified successfully",
				user: {
					...user._doc,
					password: undefined,
				},
			});
		} catch (error) {
			console.log("error in verifyEmail ", error);
			res.status(500).json({ success: false, message: "Server error" });
		}
}

const forgotPassword = async (req,res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


const resetPassword = async (req,res) => {
	try {
		const {token} = req.params;
		const {password} = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now()}
		})

		if(!user) {
			res.status(400).json({success:false, message:"Invalid or expired reset token"})
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({success:true, message:"password has been reset successfully"})
	} catch (error) {
		console.log("error in reset password",error)
		res.status(400).json({success:false, message:error.message})
	}
}


const login = async (req,res) => {
    const {email, password} = req.body
	try {
		const user = await User.findOne({email})
		if(!user) {
			return res.status(400).json({success:false , message:"User not found"})
		}

		// compers the existing password to the logged in user new enterd password
		const isPasswordValid = await bcryptjs.compare(password, user.password)

		if(!isPasswordValid) {
			res.status(401).json({success:false, message:"Invalid Password"})
		}

		// generate Token and set Cookie
		generateTokenAndSetCookie(res, user)

		// lastLogin Date
		user.lastlogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user:{
				...user._doc,
				password: undefined,
			}
		})

	} catch(error) {
		console.log("error in the server :",error)
		res.status(400).json({success:false , message:"error in the server"})
	}
}

const logout = async (req,res) => {
	res.clearCookie("token") // delete the cookie that has been set
	res.status(200).json({success:true, message:"Logged out Successfully"})
}
///// 1:52:49
const checkAuth = async (req,res) => {
	try {
		const user = await User.findById(req.userId).select("-password"); // return the user by userId without the password
		if (!user) {
			return res.status(400).json({success: false, message: "User not found"})
		}

		res.status(200).json({success: true , user});

	} catch (error) {
		console.log("Error in check", error);
		res.status(400).json({success: false, message : error.message});
	}
}

module.exports = {signup, login, logout, verifyEmail, forgotPassword, resetPassword, sendResetSuccessEmail, checkAuth}