<script lang="ts">
	// import L from 'leaflet';
	import type { Marker, LatLngTuple, LayerGroup } from 'leaflet';
	import { getContext, setContext } from 'svelte';

	let classNames: string | undefined = undefined;
	export { classNames as class };

	export let marker: Marker | undefined = undefined;
	export let width = 30;
	export let height = 30;
	export let latLng: LatLngTuple;

	const layerGroup = getContext<() => LayerGroup>('layerGroup')();
	setContext('layer', () => marker);

	function createMarker(markerElement: HTMLElement) {
		async function useLeaflet() {
			const L = await import('leaflet');
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker(latLng, { icon }).addTo(layerGroup);
		}

		useLeaflet();

		return {
			destroy() {
				if (marker) {
					marker.remove();
					marker = undefined;
				}
			}
		};
	}
</script>

<div class="hidden">
	<div use:createMarker class={classNames}>
		{#if marker}
			<slot />
		{/if}
	</div>
</div>
