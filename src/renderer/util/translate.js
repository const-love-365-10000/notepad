// 暂时废弃
export function translateToHtml(data) {
	return new Promise((resolve, reject) => {
		let dataMatch = data.match(/.*?\\n/g);
		if (!dataMatch) {
			dataMatch = [];
			dataMatch[0] = data;
		}
		console.log(dataMatch);

		let dataTemp = "";
		// md转h5
		for (let i in dataMatch) {
			console.log(dataMatch[i].match(/\#/));
			dataMatch[i].replace(/\\n$/, "");
			if (dataMatch[i].match(/\#/)) {
				let titleNumber = parseInt(dataMatch[i].match(/\# /g).length);

				dataTemp += `<h${titleNumber}>${dataMatch[i].replace(
					/\#/g,
					""
				)}</h${titleNumber}>`;
			} else {
				dataTemp += "<p>" + dataMatch[i] + "</p>";
			}
		}

		resolve(dataTemp);
	});
}

export function translateToMd(data) {
	return new Promise((resolve, reject) => {
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
	});
}
