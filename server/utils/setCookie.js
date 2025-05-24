const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-should-be-in-env-file";

exports.setAuthCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // false for localhost HTTP
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/", // Explicitly set path
  };

  res.cookie("token", token, cookieOptions);
  return token;
};
