<script lang="ts">
	import type { Marker, LatLngTuple, Map, LayerGroup } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	const L = globalThis.window.L;

	export let width = 30;
	export let height = 30;
	export let latLng: LatLngTuple;

	let markerElement: HTMLElement;
	let marker: Marker;

	const map = getContext<() => Map>('map')();
	const getLayerGroup = getContext<() => LayerGroup>('layerGroup');
	setContext('layer', () => marker);

	onMount(async () => {
		await tick(); // waits for next paint so layers and map are done rendering
		const layerGroup = getLayerGroup?.();
		const mapOrLayerGroup = layerGroup || map;
		let icon = L.divIcon({
			html: markerElement,
			className: 'map-marker',
			iconSize: L.point(width, height)
		});
		marker = L.marker(latLng, { icon });
		mapOrLayerGroup.addLayer(marker);
	});

	onDestroy(() => {
		const layerGroup = getLayerGroup?.();
		const mapOrLayerGroup = layerGroup || map;
		mapOrLayerGroup.removeLayer(marker);
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>
