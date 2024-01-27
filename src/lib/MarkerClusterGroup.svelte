<script lang="ts">
	import type { Map, MarkerClusterGroup } from 'leaflet';
	import { getContext, onMount, setContext, tick } from 'svelte';

	const map = getContext<() => Map>('map')();
	let markers: MarkerClusterGroup;

	setContext('layerGroup', () => markers);
	onMount(async () => {
		const L = window.L;
		console.log('MarkerClusterGroup mounted');
		markers = L.markerClusterGroup();
		console.log('markers', markers);
		map.addLayer(markers);
	});
</script>

<slot />
