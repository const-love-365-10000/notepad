const fs = require("fs");
export function openFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, "utf-8", (err, data) => {
			if (err) {
				reject(err);
				console.log(err);
				return;
			}

			// 针对不同的文件做不同的处理
			if (filePath.match(/\.md$/)) {
				let dataMatch = data.match(/.+\n/g);
				console.log(dataMatch);

				let dataTemp = "";
				// md转h5
				for (let i in dataMatch) {
					console.log(dataMatch[i].match(/\#/));
					if (dataMatch[i].match(/\#/)) {
						let titleNumber = parseInt(
							dataMatch[i].match(/\# /g).length
						);
						console.log("titleNumber", titleNumber);

						dataTemp += `<h${titleNumber}>${dataMatch[i].replace(
							/\#/g,
							""
						)}</h${titleNumber}>`;
					} else {
						dataTemp += "<p>" + dataMatch[i] + "</p>";
					}
				}

				resolve(dataTemp);
			} else if (filePath.match(/\.html$/)) {
				let dataMatch = data.match(/\<([a-zA-Z1-9]){1,5}\>.+\1\>/g);
				let dataTemp = "";
				console.log(dataMatch);
				// h5转md
				for (let i in dataMatch) {
					if (dataMatch[i].match(/\<[h,H][1-6]\>/)) {
						let titleNumber = parseInt(
							dataMatch[i]
								.match(/\<[h,H][1-6]\>/)[0]
								.replace(/\<[h,H]/, "")
								.replace(/\>/, "")
						);
						console.log(titleNumber);
						for (let i = 0; i < titleNumber; i++) {
							dataTemp += "#";
							if (i === titleNumber - 1) {
								dataTemp +=
									" " +
									dataMatch[i]
										.replace(/\<[a-zA-Z1-9]{1,5}\>/, "")
										.replace(/\<\/[a-zA-Z1-9]{1,5}\>/, "") +
									"\n";
							}
						}
						// dataTemp +=
						// 	"# " +
						// 	dataMatch[i]
						// 		.replace("<h1>", "")
						// 		.replace("</h1>", "") +
						// 	"\n";
					} else {
						dataTemp += dataMatch[i] + "\n";
					}
				}
				resolve(dataTemp);
			} else {
				resolve(data);
			}
		});
	});
}
