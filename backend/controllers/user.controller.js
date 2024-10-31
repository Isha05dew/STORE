import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email, fullName } = req.body;
  if (!username || !password || !email || !fullName) {
    throw new ApiError(400, "All feilds are required.");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    throw new ApiError(400, "User already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    return (
      res
        .status(201)
        // .json({
        //   _id: newUser._id,
        //   fullName: newUser.fullName,
        //   username: newUser.username,
        //   email: newUser.email,
        //   isAdmin: newUser.isAdmin,
        // });
        .json(
          new ApiResponse(
            201,
            {
              _id: newUser._id,
              fullName: newUser.fullName,
              username: newUser.username,
              email: newUser.email,
              isAdmin: newUser.isAdmin,
            },
            "User created successfully"
          )
        )
    );
  } catch (error) {
    throw new ApiError(400, "Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json(
        new ApiResponse(
          201,
          {
            _id: existingUser._id,
            fullName: existingUser.fullName,
            username: existingUser.username,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
          },
          "User Logged In Successfully"
        )
      );
      return;
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    throw new ApiError(500, "Something went wrong while fetching the users");
  }

  res
    .status(200)
    .json(new ApiResponse(200, users, "All users get successfully"));
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Current User fetched Successfully"));
  } else {
    // res.status(404);
    // throw new Error("User not found.");
    throw new ApiError(404, "User not found");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User Not found");
  }
  user.username = req.body.username || user.username;
  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();
  const showUser = await User.findById(updatedUser._id).select("-password");

  res.status(200).json(new ApiResponse(200, showUser, "Updated Successfully"));
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  if (user.isAdmin) {
    throw new ApiError(400, "Cannot delete admin user.");
  }
  await User.deleteOne({ _id: user._id });
  res.status(200).json(new ApiResponse(200, {}, "User removed."));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  res.status(200).json(new ApiResponse(200, user, "Get User Successfully"));
});

const UpdateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  user.username = req.body.username || user.username;
  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);

  const updateUser = await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: updateUser._id,
        username: updateUser.username,
        fullName: updateUser.fullName,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
      },
      "User updated successfully"
    )
  );
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  UpdateUserById,
};
