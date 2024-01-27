<script lang="ts">
	import type { LatLngExpression, Map, PathOptions, Polyline } from 'leaflet';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';

	export let latLngs: LatLngExpression[];
	export let lineStyle: PathOptions = {};
	let line: Polyline;

	let map: Map = getContext<() => Map>('map')();

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const L = window.L;
		line = new L.Polyline(latLngs);
		line.on('click', (e) => dispatch('click', e));
		line.addTo(map);
	});

	onDestroy(() => {
		line?.remove();
	});

	$: line?.setStyle(lineStyle);
</script>

<slot />
