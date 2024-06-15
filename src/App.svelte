<script lang="ts">
	import "fluent-svelte/theme.css";
	import * as Fluent from "fluent-svelte";
	import { UserObject } from "./backend/LCETool/Discord/User/UserObject";

	let displayWarningDialog = true;
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
		<Fluent.Checkbox bind:checked={listSel}>hi</Fluent.Checkbox>
		<Fluent.TextBox bind:value />
		<Fluent.ListItem bind:selected={listSel}>Text</Fluent.ListItem>
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
		<Fluent.Button on:click={() => (displayWarningDialog = true)}>Open Dialog</Fluent.Button>

		<Fluent.ContentDialog bind:open={displayWarningDialog} title="Warning">
			This software is under construction - things may be unimplemented, not work, or give unexpected output.
			Do not ask for support, open an issue report or a pull request (at <a href="https://github.com/CheatBreakerX/LCE-Tool">this repo</a>)
			if you are willing to fix the issue(s) yourself.<br/>
			<br/>
			<em>- Lifix (<a href="https://discord.com/users/180430713873498113">@lifix</a> on Discord)</em>
			<svelte:fragment slot="footer">
				<Fluent.Button on:click={() => (displayWarningDialog = false)}>Acknowledge</Fluent.Button>
			</svelte:fragment>
		</Fluent.ContentDialog>
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