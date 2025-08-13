import { asyncExe } from "../utils/asyncExecute.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateToken = async (user) => {
  try {
    return await user.generateAccessToken();
  } catch (err) {
    throw new ApiError(500, "error while generating tokens");
  }
};

const registerUser = asyncExe(async (req, res) => {
  const { name, phone, email, password } = req.body;

  if ([name, phone, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "empty field: please enter all fields");
  }

  const existingUser = await User.findOne({
    $or: [{ phoneNumber: phone }, { email: email }],
  });
  if (existingUser) {
    throw new ApiError(
      400,
      "user already exists: phone or email already exist"
    );
  }

  const user = await User.create({
    name: name,
    phoneNumber: phone,
    email: email,
    password: password,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "error creating user");
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "registered successfully: please login")
    );
});

const loginUser = asyncExe(async (req, res) => {
  const { uniqueID, password } = req.body;

  if ([uniqueID, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "empty credentials");
  }

  const user = await User.findOne(
    uniqueID.includes("@") ? { email: uniqueID } : { phoneNumber: uniqueID }
  );
  if (!user) {
    throw new ApiError(404, "user not exist");
  }

  const validateUser = await user.checkPassword(password);
  if (!validateUser) {
    throw new ApiError(401, "invalid password");
  }

  const accessToken = await generateToken(user);

  const loggedinUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedinUser, accessToken },
        "loggedin successfully"
      )
    );
});

const logoutUser = asyncExe(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "logout success"));
});

const getCurrentUser = asyncExe(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

const updateAddress = asyncExe(async (req, res) => {
  const { address } = req.body;
  if (!address) {
    throw new ApiError(400, "address is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { address } },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, user, "address updated successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser, updateAddress };
