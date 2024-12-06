import fs from "fs";
import { ApiError } from "./ApiError.js";

const unlinkFile = (file) => {
  fs.unlink(file, (err) => {
    if (err) {
      throw new ApiError(500, "error deleting file");
    }
  });
};

export { unlinkFile };
