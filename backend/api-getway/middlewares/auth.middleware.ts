import { IdentityClient } from "../clients/identity.client";

export const isAuthenticated = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  IdentityClient.verifyToken(token)
    .then((response) => {
      if (!response.isValid) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = response.user;
      next();
    })
    .catch((err) => {
      console.log(err);

      return res.status(401).json({ message: "Invalid or expired token" });
    });
};
