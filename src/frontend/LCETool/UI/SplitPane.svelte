<script lang="ts">
	let startX, startWidth, isResizing = false;
  
	function onMouseDown(event: MouseEvent): void {
		startX = event.clientX;
		startWidth = leftPane.offsetWidth;
		isResizing = true;
	}
  
	function onMouseMove(event: MouseEvent): void {
		if (!isResizing) {
			return;
		}

		const dx: number = event.clientX - startX;
		var padding: number = parseInt(leftPane.style.padding) * 2;
		if (Number.isNaN(padding)) {
			padding = 0;
		}
		leftPane.style.width = `${(startWidth + dx - padding) / window.innerWidth * 100.0}%`;
	}
  
	function onMouseUp(event: MouseEvent): void {
		isResizing = false;
	}
  
	let leftPane: HTMLElement;
	let rightPane: HTMLElement;
	let splitter: HTMLElement;
</script>

<style>
	.container {
		display: flex;
		height: 100%;
	}
	.pane {
		margin: 10px;
		padding: 10px;
		height: 600px;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 0.025);
		box-shadow: 0px 0px 10px 7.5px rgba(0, 0, 0, 0.05);
		overflow: auto;
	}
	.splitter {
		width: 5px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.1);
		margin-top: 30%;
		margin-bottom: 30%;
		cursor: ew-resize;
		user-select: none;
	}
</style>

<div class="container" on:mousemove={onMouseMove} on:mouseup={onMouseUp} on:mouseleave={onMouseUp}>
	<div class="pane" style="width:32.648125755743652%;padding:10px;" bind:this={leftPane}>
		<slot name="left"></slot>
	</div>
	<div class="splitter" on:mousedown={onMouseDown} bind:this={splitter}></div>
	<div class="pane" style="flex:1;" bind:this={rightPane}>
		<slot name="right"></slot>
	</div>
</div>