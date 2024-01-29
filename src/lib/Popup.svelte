<script lang="ts">
	import type { Layer, Popup } from 'leaflet';
	import { getContext, onDestroy, onMount } from 'svelte';
	const L = globalThis.window.L;

	export let popup: Popup | undefined = undefined;

	let popupElement: HTMLElement;

	let showContents = false;
	let popupOpen = false;
	const layer = getContext<() => Layer>('layer')();

	onMount(async () => {
		popup = L.popup().setContent(popupElement);
		layer.bindPopup(popup);
		layer.on('popupopen', () => {
			popupOpen = true;
			showContents = true;
		});
		layer.on('popupclose', () => {
			popupOpen = false;
			// change the state after the CSS transition
			setTimeout(() => {
				if (!popupOpen) {
					showContents = false;
				}
			}, 500);
		});
	});

	onDestroy(() => {
		layer.unbindPopup();
		popup?.remove();
	});
</script>

<div bind:this={popupElement}>
	{#if showContents}
		<slot />
	{/if}
</div>

<style>
	div {
		width: 120px;
	}
</style>
