const formatTime = (date,div) => {
	div = div ? div : '/';
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(div) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const changeLine = (str, ctx, initX, initY, lineHeight, canvasWidth) => {
	let arrText = str.split('');
	let line = '';
	let lineCount = 0;
	let isThreeLine = false;
	for (let n = 0; n < arrText.length; n++) {
		let testLine = line + arrText[n];
		let testWidth = ctx.measureText(testLine).width;
		if (testWidth > canvasWidth) {
			if (lineCount == 2) {
				isThreeLine = true
				let length = line.length - 2;
				line = line.substring(0, length) + '...';
				ctx.fillText(line, initX, initY);
				return false;
			}
			lineCount++;

			ctx.fillText(line, initX, initY);
			line = arrText[n];
			initY += lineHeight;
		} else {
			line = testLine;
		}
	}
	if (!isThreeLine) {
		ctx.fillText(line, initX, initY);
	}
}

module.exports = {
  formatTime: formatTime,
	changeLine: changeLine,
}
