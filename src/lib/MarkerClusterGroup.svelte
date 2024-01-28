<script lang="ts">
	import type { Map, MarkerCluster, MarkerClusterGroup } from 'leaflet';
	import { getContext, onMount, setContext, tick } from 'svelte';
	const L = globalThis.window.L;

	const map = getContext<() => Map>('map')();
	let markers: MarkerClusterGroup;

	setContext('layerGroup', () => markers);
	onMount(async () => {
		console.log('MarkerClusterGroup mounted');
		markers = L.markerClusterGroup({ iconCreateFunction });
		map.addLayer(markers);
	});

	function iconCreateFunction(cluster: MarkerCluster) {
		const count = cluster.getChildCount();
		return L.divIcon({ html: '<b>' + count + '</b>' });
	}
</script>

<slot />

<style>
	:global(b) {
		text-align: center;
		font-size: 20px;
		width: 30px;
		height: 30px;
		background: radial-gradient(circle, rgba(255, 0, 0, 0.5), transparent);
		border-radius: 50%;
		display: block;
		padding: 10px;
		transform: translate(-50%, -50%);
	}
</style>
