import { StatusCodes } from "http-status-codes";
import User from "../model/UserModel.js";
import { BadRequestError } from "../errors/Errors.js";

const signup = async (req, res) => {
    const { username, password, gender, email } = req.body;
    if (!username || !password || !gender || !email)
        throw new BadRequestError("Please Fill In All The Fields");
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const userDetails = {
        username,
        password,
        gender,
        email,
        picture: gender === "male" ? boyProfilePic : girlProfilePic,
    };
    const findUser = await User.findOne({ username });
    if (findUser) throw new BadRequestError("Username Already Exists");
    const user = await User.create(userDetails);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        jwt: { token },
        userDetails: {
            id: user._id,
            username: user.username,
            email: user.email,
            gender: user.gender,
            picture: user.picture,
        },
    });
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError("Please Fill In All The Fields");
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User Does Not Exist");
    const isMatch = await user.comparePasswords(password);
    if (isMatch) {
        const token = user.createJWT();
        res.status(StatusCodes.OK).json({
            jwt: { token },
            userDetails: {
                id: user._id,
                username: user.username,
                email: user.email,
                gender: user.gender,
                picture: user.picture,
            },
        });
    } else throw new BadRequestError("Invalid Credentials");
};

export { signup, signin };
