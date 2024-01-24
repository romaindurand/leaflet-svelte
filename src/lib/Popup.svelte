<script lang="ts">
	import type { Marker, Popup } from 'leaflet';

	import { getContext } from 'svelte';
	let classNames: string | undefined = undefined;
	export { classNames as class };
	export let popup: Popup | undefined = undefined;
	let showContents = false;
	let popupOpen = false;
	const layer = getContext<() => Marker>('layer')();

	function createPopup(popupElement: HTMLElement) {
		// let popup
		async function useLeaflet() {
			const L = await import('leaflet');
			popup = L.popup().setContent(popupElement);
			layer.bindPopup(popup);
			layer.on('popupopen', () => {
				popupOpen = true;
				showContents = true;
			});
			layer.on('popupclose', () => {
				popupOpen = false;
				// Wait for the popup to completely fade out before destroying it.
				// Otherwise the fade out looks weird as the contents disappear too early.
				setTimeout(() => {
					if (!popupOpen) {
						showContents = false;
					}
				}, 500);
			});
		}

		useLeaflet();
		return {
			destroy() {
				if (popup) {
					layer.unbindPopup();
					popup.remove();
					popup = undefined;
				}
			}
		};
	}
</script>

<div class="hidden">
	<div use:createPopup class={classNames}>
		{#if showContents}
			<slot />
		{/if}
	</div>
</div>
