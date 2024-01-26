<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/leaflet.markercluster';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import type { LatLngTuple, Map } from 'leaflet';
	import { createEventDispatcher, onMount, setContext } from 'svelte';

	export let latLng: LatLngTuple;
	export let zoom: number;

	const dispatch = createEventDispatcher();

	let map: Map;
	setContext('map', () => map);
	let container: HTMLElement;
	export { map };

	onMount(async () => {
		const L = await import('leaflet');
		map = L.map(container)
			.on('zoom', (e) => dispatch('zoom', e))
			.on('click', (e) => dispatch('click', e))
			.setView(latLng, zoom)
			.setMinZoom(5)
			.setMaxZoom(20);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
			maxZoom: 20
		}).addTo(map);
	});

	// reset view whenever coords or zoom change
	$: map?.setView(latLng, zoom);
</script>

<div class="Map" bind:this={container} style="height: 100%; width: 100%">
	{#if map}
		<slot {map} />
	{/if}
</div>
