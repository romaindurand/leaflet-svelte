<script lang="ts">
	import MarkerClusterGroup from './../lib/MarkerClusterGroup.svelte';
	import { scaleSequential } from 'd3-scale';
	import { interpolateRainbow } from 'd3-scale-chromatic';
	import '../global.css';
	import Map from '$lib/Map.svelte';
	import type L from 'leaflet';
	import Polyline from '$lib/Polyline.svelte';
	import type { LatLngBounds, LatLngTuple } from 'leaflet';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';
	import MarkerIcon from '$lib/MarkerIcon.svelte';
	import MarkerForm from '$lib/MarkerForm.svelte';
	import type { ActionData } from './$types.js';
	import { fetchPointsInBounds } from '$lib';

	export let data;
	export let form: ActionData;

	// hide form on successful submission
	$: if (form?.success) {
		showMarkerForm = false;
	}
	// use data from page load first
	let points = data.points;
	// on form submission, use points returned by the form action
	$: if (form?.points) points = form.points;

	let leafletLoaded = false;
	let showMarkerForm = false;
	let newMarkerCoords: LatLngTuple;
	let map: L.Map;
	const initialView: L.LatLngTuple = [48.85252974671835, 2.278322741840701];
	let markerLocations: L.LatLngTuple[];
	$: markerLocations = points.map((p) => p.lnglat);

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
		showMarkerForm = true;
		newMarkerCoords = [e.detail.latlng.lat, e.detail.latlng.lng];
	}

	function resizeMap() {
		map?.invalidateSize();
	}

	function leafletLoader(node: HTMLElement) {
		import('leaflet').then(() => {
			import('leaflet.markercluster').then(() => {
				leafletLoaded = true;
			});
		});
	}

	async function onViewChange(event: CustomEvent<{ bounds: LatLngBounds }>) {
		points = await fetchPointsInBounds(event.detail.bounds);
		console.log({ points });
	}
</script>

<svelte:window on:resize={resizeMap} use:leafletLoader />
<MarkerForm
	latlng={newMarkerCoords}
	open={showMarkerForm}
	on:close={() => (showMarkerForm = false)}
/>

{#if leafletLoaded}
	<Map
		bind:map
		latLng={initialView}
		zoom={18}
		on:click={onMapClick}
		on:zoom={() => console.log('map zoom')}
		on:viewChange={onViewChange}
	>
		<!-- use stringification of latLngs as key to identify lines -->
		{#each lines as { latLngs, color } (JSON.stringify(latLngs))}
			<Polyline {latLngs} lineStyle={{ color, opacity: 1, weight: 5 }} />
		{/each}

		<MarkerClusterGroup>
			<!-- use stringification of latLng as key to identify markers -->
			{#each markerLocations as latLng, i (JSON.stringify(latLng))}
				<Marker {latLng} width={30} height={30}>
					<MarkerIcon />
					<Popup>
						<div>
							{data?.points[i]?.name}
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
		</MarkerClusterGroup>
	</Map>
{/if}
