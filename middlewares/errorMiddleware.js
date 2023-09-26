const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Define a standard error response structure
  const errorResponse = {
    error: true,
    message: "An error occurred",
  };

  // Handle specific error cases
  if (err.name === "ValidationError") {
    // Validation error
    errorResponse.statusCode = 400;
    errorResponse.message = Object.values(err.errors).map((item) => item.message).join(", ");
  } else if (err.code && err.code === 11000) {
    // Duplicate key error (MongoDB)
    errorResponse.statusCode = 400;
    errorResponse.message = `${Object.keys(err.keyValue)} field must be unique`;
  }

  // Respond with the error
  res.status(errorResponse.statusCode || 500).json(errorResponse);
};

export default errorMiddleware;
