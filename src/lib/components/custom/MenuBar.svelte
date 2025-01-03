<script lang="ts">
	import Button from '../ui/button/button.svelte';

	export let homeButtonVariant: buttonVariant = 'default';
	export let addButtonVariant: buttonVariant = 'secondary';
	export let inventoryButtonVariant: buttonVariant = 'secondary';
	export let page: string = 'home';
</script>

<div class="flex flex-row">
	<Button variant={homeButtonVariant} on:click={() => (page = 'home')} class="mr-2">Home</Button>

	<Button variant={addButtonVariant} on:click={() => (page = 'add')} class="mr-2">
		Add Product
	</Button>

	<Button variant={inventoryButtonVariant} on:click={() => (page = 'inventory')} class="mr-2">
		View Inventory
	</Button>
</div>
