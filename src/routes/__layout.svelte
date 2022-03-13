<script lang="ts">
	import LeftNav from '../components/LeftNav/LeftNav.svelte';
	import '../app.css';
	let postcode;
</script>

<main>
	<slot />
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
</style>
