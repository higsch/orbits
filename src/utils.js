// source in python: https://github.com/profConradi/Python_Simulations/blob/599e7c66903166c1e5997318878a6db6f1aaa3d8/Nice_orbits.ipynb
export const meshgrid = (x, y) => {
	let xx = new Array(x.length).fill(0).map(() => new Array(y.length));
	let yy = new Array(x.length).fill(0).map(() => new Array(y.length));
	for (let j = 0; j < y.length; j++) {
		for (let k = 0; k < x.length; k++) {
			xx[j][k] = k; // change to x[k] if indexing xy
			yy[j][k] = j; // change to y[j] if indexing xy
		}
	}
	return [xx, yy];
};

export const calc_orbit = (n_points, a, b, n_iter) => {
	let area = [
		[-1, 1],
		[-1, 1],
	];
	let x = Array.from(
		{ length: n_points },
		(_, i) => area[0][0] + (i / (n_points - 1)) * (area[0][1] - area[0][0])
	);
	let y = Array.from(
		{ length: n_points },
		(_, i) => area[1][0] + (i / (n_points - 1)) * (area[1][1] - area[1][0])
	);
	let [xx, yy] = meshgrid(x, y);
	let l_cx = new Array(n_iter * n_points ** 2).fill(0);
	let l_cy = new Array(n_iter * n_points ** 2).fill(0);
	for (let i = 0; i < n_iter; i++) {
		let xx_new = xx.map((row) =>
			row.map((_, k) => Math.sin(xx[k][k] ** 2 - yy[k][k] ** 2 + a))
		);
		let yy_new = xx.map((row) =>
			row.map((_, k) => Math.cos(2 * xx[k][k] * yy[k][k] + b))
		);
		xx = xx_new;
		yy = yy_new;
		for (let j = 0; j < n_points; j++) {
			for (let k = 0; k < n_points; k++) {
				let index = i * n_points ** 2 + j * n_points + k;
				l_cx[index] = xx[j][k];
				l_cy[index] = yy[j][k];
			}
		}
	}
	return [l_cx, l_cy];
};
