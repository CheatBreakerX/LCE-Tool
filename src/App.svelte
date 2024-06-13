<script lang="ts">
	import "fluent-svelte/theme.css";
	import * as Fluent from "fluent-svelte";
	import { BlockId } from "./backend/MCCToolChest/BlockId";

	let listSel = false;
	let value = "Default value";

	let exampleFileList = [
		{
			"name": "File #1",
			"content": "Content #1"
		},
		{
			"name": "File #2",
			"content": "Content #2"
		},
		{
			"name": "File #3",
			"content": "Content #3"
		},
		{
			"name": "File #4",
			"content": "Content #4"
		},
		{
			"name": "File #5",
			"content": "Content #5"
		}
	];
</script>

<main>
	<div class="lt-app-frame">
		<Fluent.Checkbox bind:listSel>hi</Fluent.Checkbox>
		<Fluent.TextBox bind:value />
		<Fluent.ListItem selected:listSel>Text</Fluent.ListItem>
		<p>
			Current: {value} <br/>
			listSel: {listSel ? "checked" : "unchecked"}
		</p>
		<p>
			{#each exampleFileList as { name, content }}
				<p>
					{name}: {content}
				</p>
			{/each}
		</p>
	</div>
</main>

<style>
	.lt-app-frame {
		padding: 8px;
	}

	:global(body) {
		background-color: var(--fds-solid-background-base);
		color: var(--fds-text-primary);
	}

	main {
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>