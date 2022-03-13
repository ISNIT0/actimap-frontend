<script lang="ts">
	import { onMount } from 'svelte';

	export let bbox: number[][] = [
		[-7.57216793459, 49.959999905],
		[1.68153079591, 58.6350001085]
	];
	export let onMap: ((map: any, leaflet: any) => void) | undefined;
	export let onMapMove: ((event: any) => void) | undefined;

	let mapContainer;
	let map;

	onMount(async () => {
		const L = await import('leaflet');
		map = L.map(L.DomUtil.create('div'), {
			// bbox: bbox.map((coords) => coords.reverse()),
			center: [51.6047033, -0.0083096],
			zoom: 13
			// zoomControl: false
		});

		L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
		}).addTo(map);

		mapContainer.appendChild(map.getContainer());
		map.getContainer().style.width = '100%';
		map.getContainer().style.height = '100%';
		map.invalidateSize();
		map.fitBounds(bbox.map((coords) => coords.reverse()));

		if (onMapMove) {
			map.on('move', onMapMove);
		}

		onMap?.(map, L);
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
		integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
		crossorigin=""
	/>
</svelte:head>
<div class="map" bind:this={mapContainer}>
	<slot />
</div>

<style>
	.map {
		height: 100%;
		width: 100%;
	}
</style>
