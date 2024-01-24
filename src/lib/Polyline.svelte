<script lang="ts">
	import { createEventDispatcher, getContext, setContext, onDestroy, onMount } from 'svelte';
	import type { LatLngExpression, Map, PathOptions, Polyline } from 'leaflet';

	import flush from 'just-flush';
	export let latLngs: LatLngExpression[];
	export let lineStyle: PathOptions = {};
	export let pane: HTMLElement | undefined = undefined;
	export let interactive = true;
	export let style: string | undefined = undefined;

	const dispatch = createEventDispatcher();

	let layerPane = pane || getContext('pane');
	let layerGroup = getContext<() => Map>('layerGroup')();

	export let line: Polyline | undefined = undefined;
	onMount(async () => {
		const L = await import('leaflet');
		line = new L.Polyline(
			latLngs,
			flush({
				interactive,
				className: lineStyle.className,
				pane: layerPane
			})
		)
			.on('click', (e) => dispatch('click', e))
			.on('mouseover', (e) => dispatch('mouseover', e))
			.on('mouseout', (e) => dispatch('mouseout', e))
			.addTo(layerGroup);
	});

	setContext('layer', () => line);
	onDestroy(() => {
		line?.remove();
		line = undefined;
	});

	$: if (style) line?.getElement()?.setAttribute('style', style);

	$: line?.setStyle(lineStyle);

	$: {
		line?.setLatLngs(latLngs);
		line?.redraw();
	}
</script>

<slot />
