const nodeEnv = process.env.NODE_ENV;

const isProduction = nodeEnv === "production";
const environment = {
  isProduction,
  api: isProduction ? "https://example.domain.com" : "http://localhost:5000", // Environment variables system is unkown, hardcoded mode activated
};

export default environment;
