export const createDrawDots = (regl) =>
	regl({
		frag: `
    #ifdef GL_OES_standard_derivatives
      #extension GL_OES_standard_derivatives: enable
    #endif

    precision highp float;
    varying vec3 fragColor;
    varying float fragOpacity;

    void main() {
      vec2 cxy = gl_PointCoord * 2.0 - 1.0;
      float r = dot(cxy, cxy);
      float alpha = 1.0;
      #ifdef GL_OES_standard_derivatives
        float delta = fwidth(r);
        alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
      #endif

      gl_FragColor = vec4(fragColor, 1.0) * alpha * fragOpacity;
    }
`,
		vert: `
    precision highp float;

    attribute vec2 coord;
    attribute float opacity;
    attribute float radius;
    attribute vec3 color;
    
    varying vec3 fragColor;
    varying float fragOpacity;
    
    void main() {
        gl_PointSize = radius;
        fragColor = color;
        fragOpacity = opacity;
        gl_Position = vec4(coord, 0.0, 1.0);
    }
`,
		attributes: {
			coord: (_, props) => props.coordinates,
			opacity: (_, props) => props.opacities || Array.from({length: props.coordinates.length}, () => 0.1),
			radius: (_, props) => props.radii || Array.from({length: props.coordinates.length}, () => 5.0),
			color: (_, props) => props.colors || Array.from({length: props.coordinates.length}, () => ([1, 1, 1]))
		},
		blend: {
			enable: true,
			func: {
				srcRGB: 'src alpha',
				srcAlpha: 'src alpha',
				dstRGB: 'one minus src alpha',
				dstAlpha: 'one minus src alpha',
			},
		},
		count: (_, props) => props.coordinates.length,
		primitive: 'points',
	});
