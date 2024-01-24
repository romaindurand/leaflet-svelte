<script lang="ts">
	import { scaleSequential } from 'd3-scale';
	import { interpolateRainbow } from 'd3-scale-chromatic';
	import '../global.css';
	import Map from '$lib/Map.svelte';
	import type L from 'leaflet';
	import Polyline from '$lib/Polyline.svelte';
	import type { LatLngTuple } from 'leaflet';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';

	let map: L.Map;
	const initialView: L.LatLngTuple = [48.85252974671835, 2.278322741840701];
	let markerLocations: L.LatLngTuple[] = [];

	$: colors = scaleSequential(interpolateRainbow).domain([0, markerLocations.length - 1]);
	$: lines = markerLocations.slice(1).map((latLng, i) => {
		let prev = markerLocations[i];
		return {
			latLngs: [prev, latLng],
			color: colors(i)
		};
	});

	function onMapClick(e: CustomEvent<L.LeafletMouseEvent>) {
		const latlngTuple: LatLngTuple = [e.detail.latlng.lat, e.detail.latlng.lng];
		markerLocations = [...markerLocations, latlngTuple];
	}

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

<Map bind:map view={initialView} zoom={18} on:click={onMapClick}>
	{#each lines as { latLngs, color }}
		<Polyline {latLngs} lineStyle={{ color, opacity: 0.5 }} />
	{/each}

	{#each markerLocations as latLng}
		<Marker {latLng} width={30} height={30}>
			<svg
				style="width:30px;height:30px"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				viewBox="0 0 24 24"
				stroke="currentColor"
				><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg
			>

			<Popup>A popup! {latLng[0]}, {latLng[1]}</Popup>
		</Marker>
	{/each}
</Map>
