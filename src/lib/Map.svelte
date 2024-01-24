<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import type { Map, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	export let height = '100%';
	export let width = '100%';
	export let bounds: Bounds = null;
	export let view: View = null;
	export let zoom: Zoom = null;

	let mapProp = undefined;
	export { mapProp as map };

	export const invalidateSize = () => map?.invalidateSize();

	type Bounds = LatLngBoundsExpression | null;
	type View = LatLngExpression | null;
	type Zoom = number | null;

	const dispatch = createEventDispatcher();

	let map: Map | null = null;
	$: mapProp = map;

	export const getMap = () => map;
	setContext('layerGroup', getMap);
	setContext('layer', getMap);
	setContext('map', getMap);

	function fitMap(bounds: Bounds, view: View, zoom: Zoom) {
		if (!map) return;
		if (bounds) {
			map?.fitBounds(bounds);
		} else {
			if (view === null || zoom === null) {
				throw new Error('Must set either bounds, or view and zoom.');
			}
			map?.setView(view, zoom);
		}
	}

	function createMap(node: HTMLElement) {
		createLeaflet(node);

		return {
			destroy() {
				map?.remove();
				map = null;
			}
		};
	}

	async function createLeaflet(node: HTMLElement) {
		const L = await import('leaflet');
		map = L.map(node)
			.on('zoom', (e) => dispatch('zoom', e))
			.on('click', (e) => dispatch('click', e));

		map.setMaxZoom(18);
		map.setMinZoom(4);
		fitMap(bounds, view, zoom);

		// free raster tiles providers : https://wiki.openstreetmap.org/wiki/Raster_tile_providers
		// https://alexurquhart.github.io/free-tiles/
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
			&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
			subdomains: 'abcd',
			maxZoom: 18
		}).addTo(map);
	}

	$: fitMap(bounds, view, zoom);
</script>

<div style="height:{height};width:{width}" use:createMap class="Map">
	{#if map}
		<slot {map} />
	{/if}
</div>

<style>
	.Map :global(.leaflet-control-container) {
		position: static;
	}

	.Map :global(.leaflet-popup-content) {
		width: 100px;
	}
</style>
