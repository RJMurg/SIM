<script lang="ts">
	import Button from '../../ui/button/button.svelte';

	export let productsButtonVariant: buttonVariant = 'default';
	export let locationsButtonVariant: buttonVariant = 'secondary';
	export let employeesButtonVariant: buttonVariant = 'secondary';
	export let page: string = 'products';
</script>

<div class="flex flex-row">
	<Button variant={productsButtonVariant} on:click={() => (page = 'products')} class="mr-2">
		Products
	</Button>

	<Button variant={locationsButtonVariant} on:click={() => (page = 'locations')} class="mr-2">
		Locations
	</Button>

	<Button variant={employeesButtonVariant} on:click={() => (page = 'employees')} class="mr-2">
		Employees
	</Button>
</div>
