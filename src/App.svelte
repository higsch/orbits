<script>
  import { calc_orbit } from './math';
  import { createDrawDots } from './shader';

  import ReglCanvas from './ReglCanvas.svelte';

  const n_points = 500;
  const n_iter = 20;
  const a = 5.46;
  const b = 4.55;
  const points = calc_orbit(n_points, a, b, n_iter);

  let width, height;
  let regl;

  $: if (regl) {
    const drawDots = createDrawDots(regl);

    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    });

    drawDots({coordinates: points});
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