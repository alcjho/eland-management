import { RpcException } from "@nestjs/microservices";

export const getValidationError = (error) => {
  if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
      }));

      return { status: 400, message: "Validation failed", errors: validationErrors };
    } else {
      throw new RpcException({ status: 500, message: "Internal server error" });
    }
} 