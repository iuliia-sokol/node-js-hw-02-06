const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const avatarSize = 250;

const register = async (req, res) => {
  const { email, password, subscription } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const result = await User.create({
    email,
    password: hashPassword,
    subscription,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw HttpError(400, "Email or password is missing");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;

  res.status(200).json({
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateSubscription = async (req, res) => {
  const result = await User.findOneAndUpdate(req.user._id, req.body, {
    new: true,
  });

  res.json({ result });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "Avatar must be provided");
  }
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const avatarURL = path.join("avatars", filename);

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(Jimp.AUTO, avatarSize).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    user: {
      id: _id,
      avatarURL,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
