const fs = require("fs");
exports.deleteFile = (f) => {
  fs.unlink(f, (err) => {
    if (err) {
      throw err;
    }
  });
};
