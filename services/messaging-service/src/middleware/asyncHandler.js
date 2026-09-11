const asyncHandler = (fu) => {
  return (req, res, next) => Promise.resolve(fu(req, res, next)).catch(next);
};


export default asyncHandler