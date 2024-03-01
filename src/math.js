import { max, rgb, interpolateMagma as colorInterpolator } from 'd3';

// source in python: https://github.com/profConradi/Python_Simulations/blob/599e7c66903166c1e5997318878a6db6f1aaa3d8/Nice_orbits.ipynb
export const meshgrid = (x, y) => {
	const xx = new Array(x.length).fill(0).map(() => new Array(y.length));
	const yy = new Array(x.length).fill(0).map(() => new Array(y.length));
	for (let j = 0; j < y.length; j++) {
		for (let k = 0; k < x.length; k++) {
			xx[j][k] = k;
			yy[j][k] = j;
		}
	}
	return [xx, yy];
};

export const calc_orbit = (n_points, a, b, n_iter) => {
	const area = [
		[-1, 1],
		[-1, 1],
	];
	const x = Array.from(
		{ length: n_points },
		(_, i) => area[0][0] + (i / (n_points - 1)) * (area[0][1] - area[0][0])
	);
	const y = Array.from(
		{ length: n_points },
		(_, i) => area[1][0] + (i / (n_points - 1)) * (area[1][1] - area[1][0])
	);
	let [xx, yy] = meshgrid(x, y);
	const l_cx = new Array(n_iter * n_points ** 2).fill(0);
	const l_cy = new Array(n_iter * n_points ** 2).fill(0);
	for (let i = 0; i < n_iter; i++) {
		const xx_new = xx.map((row) =>
			row.map((_, k) => Math.sin(xx[k][k] ** 2 - yy[k][k] ** 2 + a))
		);
		const yy_new = xx.map((row) =>
			row.map((_, k) => Math.cos(2 * xx[k][k] * yy[k][k] + b))
		);
		xx = xx_new;
		yy = yy_new;
		for (let j = 0; j < n_points; j++) {
			for (let k = 0; k < n_points; k++) {
				const index = i * n_points ** 2 + j * n_points + k;
				l_cx[index] = xx[j][k];
				l_cy[index] = yy[j][k];
			}
		}
	}
	return [l_cx, l_cy];
};

export const histogram_2d = (
	dataX,
	dataY,
	{ binsX = 1000, binsY = 1000, rangeX = [-1, 1], rangeY = [-1, 1] } = {}
) => {
	const histogram = [];
	for (let i = 0; i < binsX; i++) {
		histogram[i] = new Array(binsY).fill(0);
	}

	const binSizeX = (rangeX[1] - rangeX[0]) / binsX;
	const binSizeY = (rangeY[1] - rangeY[0]) / binsY;

	// Iterate over data and fill histogram
	for (let i = 0; i < dataX.length; i++) {
		const x = dataX[i];
		const y = dataY[i];

		const binX = Math.floor((x - rangeX[0]) / binSizeX);
		const binY = Math.floor((y - rangeY[0]) / binSizeY);

		if (binX >= 0 && binX < binsX && binY >= 0 && binY < binsY) {
			histogram[binX][binY]++;
		}
	}

	return histogram;
};

export const points_from_histogram = (
	histogram,
	{
		rangeX = [-1, 1],
		rangeY = [-1, 1],
		maxValue = undefined,
		valueTransform = (v) => v,
		interpolator = colorInterpolator,
	} = {}
) => {
	const coordinates = [];
	const values = [];
	for (let i = 0; i < histogram.length; i++) {
		for (let j = 0; j < histogram[i].length; j++) {
			let x = rangeX[0] + (i * (rangeX[1] - rangeX[0])) / histogram.length;
			let y = rangeY[0] + (j * (rangeY[1] - rangeY[0])) / histogram[i].length;
			coordinates.push([x, y]);
			values.push(valueTransform(histogram[i][j]));
		}
	}

	const filteredCoordinates = coordinates.filter(
		(_, i) => values[i] > -Infinity
	);
	const filteredValues = values.filter((v) => v > -Infinity);

	const calculatedMaxValue = max(filteredValues);
	const colors = filteredValues.map((v) => {
		const { r, g, b } = rgb(interpolator(v / (maxValue || calculatedMaxValue)));
		return [r / 255, g / 255, b / 255];
	});

	return [filteredCoordinates, colors];
};
