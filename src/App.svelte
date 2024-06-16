<script lang="ts">
	import "fluent-svelte/theme.css";
	import * as Fluent from "fluent-svelte";
	import * as Svelte from "svelte";
	import SplitPane from "./frontend/LCETool/UI/SplitPane.svelte";

	let displayAboutDialog: boolean = false;
	let displayWarningDialog: boolean = true;
	let listSel: boolean = false;
	let value: string = "Default value";

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

	Svelte.onMount(() => {
		window["electron"].ipcRenderer.on("open-about", (event, data) => {
			displayAboutDialog = true;
		});
	});
</script>

<main>
	<!--div class="lt-app-frame">
		<Fluent.Checkbox bind:checked={listSel}>hi</Fluent.Checkbox>
		<Fluent.TextBox bind:value />
		<Fluent.ListItem bind:selected={listSel} on:click={() => (listSel = !listSel)}>Text</Fluent.ListItem>
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
	</div-->
	<SplitPane>
		<div slot="left">
			<h1>Left Pane</h1>
			<p>the data path (file?) explorer will go here</p>
		</div>
		<div slot="right">
			<h1>Right Pane</h1>
			<p>the nbt editor will go here, have some test stuff</p>

			<Fluent.Checkbox bind:checked={listSel}>hi</Fluent.Checkbox>
			<Fluent.TextBox bind:value />
			<Fluent.ListItem bind:selected={listSel} on:click={() => (listSel = !listSel)}>Text</Fluent.ListItem>
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
		</div>
	</SplitPane>

	<Fluent.ContentDialog bind:open={displayAboutDialog} title="About LCE Tool">
		<div style="display:flex;">
			<div style="width:96px;">
				<img src="favicon.png" alt="Logo" width="96px" />
			</div>
			<div style="flex:1;padding-left:10px;">
				<h4 style="margin:0;">LCE Tool</h4>
				<p>
					Version 1.0.0 <br/>
					Copyright &copy; Zero Mods, 2024
				</p>
			</div>
		</div>
		<svelte:fragment slot="footer">
			<Fluent.Button on:click={() => (window.open("https://github.com/CheatBreakerX/LCE-Tool", "_blank"))}>Source Code</Fluent.Button>
			<Fluent.Button on:click={() => (window.open("discord://-/invite/dPzJajt", "_self"))}>Discord</Fluent.Button>
			<Fluent.Button variant="accent" on:click={() => (displayAboutDialog = false)}>OK</Fluent.Button>
		</svelte:fragment>
	</Fluent.ContentDialog>

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
</main>

<style>
	:global(body) {
		background-color: var(--fds-solid-background-base);
		color: var(--fds-text-primary);
	}

	main {
		margin: 0 auto;
	}
</style>