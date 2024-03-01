<script>
	import { calc_orbit, histogram_2d, points_from_histogram } from './math';
	import { createDrawDots } from './shader';

	import ReglCanvas from './ReglCanvas.svelte';

	const n_points = 500;
	const n_iter = 100;
	const a = 3.494;
	const b = 4.173;
	const bins = 2000;
	const [x, y] = calc_orbit(n_points, a, b, n_iter);
	const histogram = histogram_2d(x, y, { binsX: bins, binsY: bins, rangeX: [-0.7, -0.1], rangeY: [-0.6, 0.0]});
	const [coordinates, colors] = points_from_histogram(histogram, {
		valueTransform: (v) => Math.log(v),
	});

	let width, height;
	let regl;

	$: if (regl) {
		const drawDots = createDrawDots(regl);

		regl.clear({
			color: [0, 0, 0, 1],
			depth: 1,
		});

		drawDots({ coordinates, colors });
	}
</script>

<main
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<ReglCanvas
		width={width}
		height={height}
		bind:regl={regl}
	/>
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
