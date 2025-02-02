<script lang="ts">
	import * as Svelte from "svelte";
	import * as Fluent from "fluent-svelte";
	import { FileTreeItemType } from "../../../backend/LCETool/UI/FileTreeItemType";
	import type { FileTreeItem } from "../../../backend/LCETool/UI/FileTreeItem";

	export let allFiles: FileTreeItem[] = [];
	export let files: FileTreeItem[] = [];

	function getAllFiles(): FileTreeItem[] {
		return allFiles.length == 0 ? files : allFiles;
	}

	function getFileList(treeItem: FileTreeItem): FileTreeItem[] {
		if (treeItem === null || treeItem === undefined || treeItem.type != FileTreeItemType.Folder) {
			return [];
		}

		return treeItem.content as FileTreeItem[];
	}

	function killNon(filesIn: FileTreeItem[], treeItem: FileTreeItem) {
		for (const file of filesIn) {
			if (file.type === FileTreeItemType.File) {
				if (file !== treeItem) {
					file.selected = false;
				}
			}
			else if (file.type === FileTreeItemType.Folder) {
				killNon(file.content as FileTreeItem[], treeItem);
			}
		}
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
			killNon(getAllFiles(), file);
			/*for (const other of files) {
				if (other.type === FileTreeItemType.File && other !== file) {
					other.selected = false;
				}
			}*/
		}}>
			<div style="margin-left:15px;">
				{file.label}
			</div>
		</Fluent.ListItem>
	{:else if file.type == FileTreeItemType.Folder}
		<!-- file.content should be of type FileTreeItem[] -->
		<Fluent.ListItem on:click={() => (file.selected = !file.selected)}>
			{#if file.selected}
				{`▽ `}
			{:else}
				{`▷ `}
			{/if}
			{file.label}
		</Fluent.ListItem>
		{#if file.selected}
			<div style="margin-left:20px;">
				<svelte:self allFiles={getAllFiles()} bind:files={file.content} />
			</div>
		{/if}
	{/if}
{/each}