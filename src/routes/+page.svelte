<script lang="ts">
	import type { PageData } from './$types';
	import MenuBar from '$lib/components/custom/menus/MenuBar.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import ProductSection from '$lib/components/custom/products/ProductSection.svelte';
	import LocationSection from '$lib/components/custom/locations/LocationSection.svelte';
	import EmployeeSection from '$lib/components/custom/employees/EmployeeSection.svelte';

	let { data }: { data: PageData } = $props();

	let page = $state('products');
	let productsButtonVariant: buttonVariant = $derived(
		page === 'products' ? 'default' : 'secondary'
	);
	let locationsButtonVariant: buttonVariant = $derived(
		page === 'locations' ? 'default' : 'secondary'
	);
	let employeesButtonVariant: buttonVariant = $derived(
		page === 'employees' ? 'default' : 'secondary'
	);
</script>

<div class="h-screen w-screen p-4">
	<Card class="h-full w-full p-4">
		<div class="mb-2 flex h-1/6 w-full flex-col items-center justify-center">
			<div class="mb-2 flex w-full flex-row items-center justify-center">
				<enhanced:img src="/static/sim.png" alt="SIM Logo" class="mr-4 h-auto w-12" />
				<h1 class="text-4xl font-bold">SIM</h1>
				<enhanced:img src="/static/sim.png" alt="SIM Logo" class="ml-4 h-auto w-12" />
			</div>

			<MenuBar
				{productsButtonVariant}
				{locationsButtonVariant}
				{employeesButtonVariant}
				bind:page
			/>
		</div>

		<Card class="h-5/6 w-full">
			<div class="flex h-full w-full flex-col items-center justify-center">
				{#if page === 'products'}
					<ProductSection products={data.products} />
				{:else if page === 'locations'}
					<LocationSection locations={data.locations} />
				{:else if page === 'employees'}
					<EmployeeSection employee={data.employees} />
				{/if}
			</div>
		</Card>
	</Card>
</div>
