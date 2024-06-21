<script lang="ts">
	import * as Fluent from "fluent-svelte";
	import { FileTreeItemType } from "../../../backend/LCETool/UI/FileTreeItemType";
	import type { FileTreeItem } from "../../../backend/LCETool/UI/FileTreeItem";

	export let files: FileTreeItem[] = [
		{
			type: FileTreeItemType.Folder,
			label: "Super (it doesn't work)",
			content: [
				{
					type: FileTreeItemType.File,
					label: "very super (but not actually) (it doesn't work)",
					content: "Good content (it doesn't work)"
				}
			]
		},
		{
			type: FileTreeItemType.File,
			label: "A file (it doesn't work)",
			content: "The content (it doesn't work)"
		},
		{
			type: FileTreeItemType.File,
			label: "Another file (it doesn't work)",
			content: "The other content (it doesn't work)"
		}
	];
</script>

{#each files as file}
	{#if file.type == FileTreeItemType.File}
		{#if file.selected === null || file.selected === undefined}
			{() => {
				file.selected = false;
				return "";
			}}
		{/if}
		<Fluent.ListItem bind:selected={file.selected} on:click={() => {
			file.selected = !file.selected;
			for (var other of files) {
				if (other.type === FileTreeItemType.File && other !== file) {
					other.selected = false;
				}
			}
		}}>
			{file.label}
		</Fluent.ListItem>
	{:else if file.type == FileTreeItemType.Folder}
		<Fluent.ListItem on:click={() => (file.selected = !file.selected)}>
			{file.label}
			{#if file.selected}
				{` (Open)`}
			{/if}
		</Fluent.ListItem>
		{#if file.selected}
			<div style="margin-left:20px;">
				<svelte:self bind:files={file.content} />
			</div>
		{/if}
	{/if}
{/each}