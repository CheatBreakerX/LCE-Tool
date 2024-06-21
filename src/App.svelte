<script lang="ts">
	import "fluent-svelte/theme.css";
	import * as Fluent from "fluent-svelte";
	import * as Svelte from "svelte";
	import SplitPane from "./frontend/LCETool/UI/SplitPane.svelte";
	import type { FileTreeItem } from "./backend/LCETool/UI/FileTreeItem";
	import { FileTreeItemType } from "./backend/LCETool/UI/FileTreeItemType";
	import FileTree from "./frontend/LCETool/UI/FileTree.svelte";

	let displayAboutDialog: boolean = false;
	let displayWarningDialog: boolean = true;
	let listSel: boolean = false;
	let value: string = "Default value";

	let exampleFileList: FileTreeItem[] = [
		{
			type: FileTreeItemType.Folder,
			label: "Super",
			content: [
				{
					type: FileTreeItemType.File,
					label: "very super (but not actually)",
					content: "Good content"
				},
				{
					type: FileTreeItemType.File,
					label: "extremely super (but not actually)",
					content: "Better content"
				},
				{
					type: FileTreeItemType.File,
					label: "super super (but not actually)",
					content: "Best content"
				}
			]
		},
		{
			type: FileTreeItemType.File,
			label: "A file",
			content: "The content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file",
			content: "The other content"
		}
	];

	Svelte.onMount(() => {
		window["electron"].ipcRenderer.on("open-about", (event, data) => {
			displayAboutDialog = true;
		});
	});
</script>

<main>
	<SplitPane>
		<div slot="left">
			<FileTree bind:files={exampleFileList} />
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