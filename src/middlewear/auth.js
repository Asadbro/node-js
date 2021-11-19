import jwt from "jsonwebtoken";
const secret = "test";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let decodedData;

    try {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
      console.log("decodedData", decodedData)
      next();
    } catch (err) {
      res.json({ message: "token expired" });
    }
  } catch (error) {
    console.log(error);
  }
};

export default auth;
