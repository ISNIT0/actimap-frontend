<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	let map;
	let L;
	let constituencyData;
	let postcodeConstituency = [];
	import LeftNav from '../components/LeftNav/LeftNav.svelte';
	import LeafletMap from '../components/LeafletMap.svelte';
	import LeafletMarker from '../components/LeafletMarker.svelte';
	import { onMount } from 'svelte';
	import { debounce } from '../lib/debounce';
	import { config } from '../config';
	let constituencyGeoJSON;

	const today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);

	const oneWeek = new Date();
	oneWeek.setHours(0);
	oneWeek.setMinutes(0);
	oneWeek.setSeconds(0);
	oneWeek.setDate(oneWeek.getDate() + 7);

	let postcode;
	let from = today;
	let to = oneWeek;
	let bbox;

	let events;

	async function onMap(_map, _L) {
		map = _map;
		L = _L;
		constituencyData = await fetch(
			`https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/gb/wpc.json`
		).then((r) => r.json());
		constituencyGeoJSON = L.geoJSON(constituencyData, {
			style: () => {
				return { fillOpacity: 0 };
			}
		});
		constituencyGeoJSON.addTo(map);
		const niConstituencyData = await fetch(
			`https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/electoral/ni/wpc.json`
		).then((r) => r.json());
		L.geoJSON(niConstituencyData).addTo(map);
	}

	function onSetFilter({ from: _from, to: _to }) {
		from = _from;
		to = _to;
	}

	async function onSetPostcode(_postcode) {
postcode = _postcode;
		const { constituency: constituencyName } = postcodeConstituency.find(
			(pc) => pc.postcode === postcode.toUpperCase()
		);

		constituencyGeoJSON.eachLayer(function (layer) {
			if (layer.feature.properties.PCON13NM === constituencyName) {
				map.flyToBounds(layer.getBounds());
			}
		});
	}

	const onMapMove = debounce(function _onMapMove(ev) {
		const mapBounds = map.getBounds();
		bbox = mapBounds.toBBoxString();
	}, 1000);

	onMount(async () => {
		postcodeConstituency = (await import('../lib/postcodeConstituency.json')).default;
	});

	async function fetchEvents({ from, to, bbox }) {
		events = await fetch(
			`${config.apiUrl}/events?from=${from.toISOString()}&to=${to.toISOString()}${
				bbox ? `&bbox=${bbox}` : ''
			}`
		).then((r) => r.json());
	}

	$: {
		fetchEvents({ from, to, bbox });
	}
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main>
	<LeftNav {onSetPostcode} {onSetFilter} filter={{ from, to }}  {events} {postcode}/>
	<section>
		<LeafletMap {onMap} {onMapMove}>
			{#if events}
			{#each events as event}
				<LeafletMarker
					lat={Number(event.latitude)}
					lng={Number(event.longitude)}
					content={`<h3>${event.summary}</h3>
					<a href='${event.whatsApp}' target='_blank'>WhatsApp Group</a><br /><br />
					Organised by ${event.contact}<br />
					${event.description}
					`}
					{map}
				/>
			{/each}
			{/if}
		</LeafletMap>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
		height: 100vh;
		width: 100%;
		margin: 0;
		box-sizing: border-box;
	}
	section {
		width: 100%;
		height: 100%;
	}
</style>
