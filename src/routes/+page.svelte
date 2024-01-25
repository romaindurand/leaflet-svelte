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
	import MarkerIcon from '$lib/MarkerIcon.svelte';

	export let data;

	let map: L.Map;
	const initialView: L.LatLngTuple = [48.85252974671835, 2.278322741840701];
	let markerLocations: L.LatLngTuple[] = data.points.map((p) => p.lnglat);

	$: colors = scaleSequential(interpolateRainbow).domain([0, markerLocations.length - 1]);
	$: lines = markerLocations.slice(1).map((latLng, i) => {
		let prev = markerLocations[i];
		return {
			latLngs: [prev, latLng],
			color: colors(i)
		};
	});

	function onMapClick(e: CustomEvent<L.LeafletMouseEvent>) {
		console.log('map clicked');
		const latlngTuple: LatLngTuple = [e.detail.latlng.lat, e.detail.latlng.lng];
		markerLocations = [...markerLocations, latlngTuple];
	}

	function resizeMap() {
		map?.invalidateSize();
	}
</script>

<svelte:window on:resize={resizeMap} />

<Map
	bind:map
	latLng={initialView}
	zoom={18}
	on:click={onMapClick}
	on:zoom={() => console.log('map zoom')}
>
	{#each lines as { latLngs, color }}
		<Polyline {latLngs} lineStyle={{ color, opacity: 0.5 }} />
	{/each}

	{#each markerLocations as latLng, i}
		<Marker {latLng} width={30} height={30}>
			<MarkerIcon />
			<Popup>
				<div>
					{data.points[i].name}
				</div>
				<div>
					{latLng[0]}
				</div>
				<div>
					{latLng[1]}
				</div>
			</Popup>
		</Marker>
	{/each}
</Map>
