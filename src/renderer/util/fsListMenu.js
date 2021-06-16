const fs = require("fs");

function deleteFile(path) {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err) => {
			if (err) {
				console.log(err);
				reject(err);
				return;
			}

			resolve();
		});
	});
}
function createFile(path) {
	return new Promise((resolve, reject) => {
		fs.access(path, fs.constants.F_OK, (err) => {
			if (!err) {
				console.log("文件已存在");
				reject("文件已存在");
			} else {
				fs.writeFile(path, "", { flag: "a" }, (err) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					resolve();
				});
			}
		});
	});
}

export default {
	deleteFile,
	createFile,
};
