const getToken = async (req) => {
  const authHeader = await req.headers.authorization;

  if (!authHeader) return false;
  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return false;
  }
  return tokenParts[1];
};

export default getToken;
