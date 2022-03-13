<script>
	// import * as L from "leaflet";
	import { onMount, onDestroy } from 'svelte';

	export let content;
	export let lat = 0;
	export let lng = 0;
	export let map;

	let L;
  let marker;

	$: {
    if(marker)  marker.removeFrom(map);
		if (map && L && lat && lng) {
			marker = L.marker([lat, lng]).bindPopup(content);
      marker.addTo(map);
		}
	}

	onMount(async () => {
		L = await import('leaflet');
	});

  onDestroy(() => {
    marker.removeFrom(map);
  })
</script>
