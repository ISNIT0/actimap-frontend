<script>
	export let onSetPostcode;
	export let postcode;
	export let onSetFilter;
	export let filter = { from: new Date(), to: new Date() };
	export let events;
	let from;
	let to;
	$: ({ from, to } = filter);
	let _postcode = '';
</script>

<aside>
	<div class="filters">
		<input
			type="date"
			value={from.toISOString().split('T')[0]}
			name=""
			id=""
			placeholder="From"
			on:change={(ev) => {
				onSetFilter({ from: new Date(ev.target.value), to });
			}}
		/>
		<input
			type="date"
			value={to.toISOString().split('T')[0]}
			name=""
			id=""
			placeholder="To"
			on:change={(ev) => onSetFilter({ to: new Date(ev.target.value), from })}
		/>
	</div>

	<section>
		{#if !events || !events.length || !postcode}
			<div class="postcode">
				<h1>Conservative Canvassing Opportunities</h1>
				<p>Enter your postcode to find all the canvassing opportunities near you</p>
				<form
					on:submit={(ev) => {
						ev.preventDefault();
						ev.stopPropagation();
						onSetPostcode(_postcode);
					}}
				>
					<input type="text" placeholder="Postcode" bind:value={_postcode} />
					<button type="submit">Go</button>
				</form>
			</div>
		{:else}
			<div class="events">
				{#each events as event}
					<div class="event">
						<h3>{event.summary}</h3>
						<h4>{new Date(event.startAt).toISOString()}</h4>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</aside>

<style>
	aside {
		width: 30%;
		height: 100%;
		background: #00aeef;
	}

	.filters {
		display: flex;
	}
	.filters input {
		width: 100%;
	}

	input {
		padding: 16px;
		width: 100%;
	}
	button {
		width: 100%;
		padding: 16px;
		margin-top: 4px;
	}
	.postcode {
		height: 100%;
		width: 80%;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: white;
		margin: auto;
	}
	h1 {
		margin: 0;
		font-size: 140%;
	}
</style>
