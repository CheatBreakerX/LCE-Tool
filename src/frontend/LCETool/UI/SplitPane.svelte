<script lang="ts">
	let startX, startWidth, isResizing = false;

	function elementValid(element: HTMLElement): boolean {
		return element !== null && element !== undefined && element !== void 0;
	}
  
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

	function adjustPaneSize(event: any): void {
		if (!(elementValid(leftPane) && elementValid(rightPane) && elementValid(splitter))) {
			return;
		}

		var h = window.innerHeight;

		const paneHeight: number = h - 68;
		const splitterMargin: number = (paneHeight / 2) - 50;

		leftPane.style.height = `${paneHeight}px`;
		rightPane.style.height = `${paneHeight}px`;
		splitter.style.marginTop = `${splitterMargin}px`;
		splitter.style.marginBottom = `${splitterMargin}px`;
	}

	window.addEventListener("DOMContentLoaded", adjustPaneSize);
	window.addEventListener("resize", adjustPaneSize);
  
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
	<script lang="ts">
		//onResize(null);
	</script>
</div>