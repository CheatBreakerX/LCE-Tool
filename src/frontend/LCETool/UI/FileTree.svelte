<script lang="ts">
	import * as Svelte from "svelte";
	import * as Fluent from "fluent-svelte";
	import { FileTreeItemType } from "../../../backend/LCETool/UI/FileTreeItemType";
	import type { FileTreeItem } from "../../../backend/LCETool/UI/FileTreeItem";

	export let files: FileTreeItem[] = [];

	function getFileList(treeItem: FileTreeItem): FileTreeItem[] {
		if (treeItem.type != FileTreeItemType.Folder) {
			return [];
		}

		return treeItem.content as FileTreeItem[];
	}

	Svelte.onMount(() => {
		for (const file of files) {
			if (file.selected === null || file.selected === undefined) {
				file.selected = false;
			}

			getFileList(file).forEach(subFile => {
				if (subFile.type === FileTreeItemType.File) {
					subFile.parent = files;
				}
			});
		}
	});
</script>

{#each files as file}
	{#if file.type == FileTreeItemType.File}
		<!-- file.content should be of type string (or proper type later on) -->
		<Fluent.ListItem bind:selected={file.selected} on:click={() => {
			file.selected = !file.selected;
			for (const other of files) {
				if (other.type === FileTreeItemType.File && other !== file) {
					other.selected = false;
				}
			}
		}}>
			{file.label}
		</Fluent.ListItem>
	{:else if file.type == FileTreeItemType.Folder}
		<!-- file.content should be of type FileTreeItem[] -->
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