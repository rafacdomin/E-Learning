export default {
  jwt: {
    secret: String(process.env.JWT_SECRET),
    expires: process.env.JWT_EXPIRES_IN,
  },
};
