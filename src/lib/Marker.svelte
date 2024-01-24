<script lang="ts">
	import type { Marker, LatLngTuple, Map } from 'leaflet';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';

	export let width = 30;
	export let height = 30;
	export let latLng: LatLngTuple;

	let markerElement: HTMLElement;
	let marker: Marker;

	const map = getContext<() => Map>('map')();
	setContext('layer', () => marker);

	onMount(async () => {
		const L = await import('leaflet');
		let icon = L.divIcon({
			html: markerElement,
			className: 'map-marker',
			iconSize: L.point(width, height)
		});
		marker = L.marker(latLng, { icon }).addTo(map);
	});

	onDestroy(() => {
		marker?.remove();
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>
