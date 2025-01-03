<script lang="ts">
	import MenuBar from '$lib/components/custom/MenuBar.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	let page = $state('products');
	let productsButtonVariant: buttonVariant = $state('default');
	let locationsButtonVariant: buttonVariant = $state('secondary');
	let employeesButtonVariant: buttonVariant = $state('secondary');

	$effect(() => {
		if (page === 'products') {
			productsButtonVariant = 'default';
			locationsButtonVariant = 'secondary';
			employeesButtonVariant = 'secondary';
		} else if (page === 'locations') {
			productsButtonVariant = 'secondary';
			locationsButtonVariant = 'default';
			employeesButtonVariant = 'secondary';
		} else if (page === 'employees') {
			productsButtonVariant = 'secondary';
			locationsButtonVariant = 'secondary';
			employeesButtonVariant = 'default';
		}
	});
</script>

<div class="h-screen w-screen p-4">
	<Card class="h-full w-full p-4">
		<div class="flex h-1/6 w-full flex-col items-center justify-center mb-2">
			<div class="flex w-full flex-row items-center justify-center mb-2">
				<img src="./sim.png" alt="SIM Logo" class="mr-4 h-auto w-12" />
				<h1 class="text-4xl font-bold">SIM</h1>
				<img src="./sim.png" alt="SIM Logo" class="ml-4 h-auto w-12" />
			</div>

			<MenuBar {productsButtonVariant} {locationsButtonVariant} {employeesButtonVariant} bind:page />
		</div>

		<Card class="h-5/6 w-full">
			<div class="w-full h-full flex flex-col items-center justify-center">
				{#if page === 'products'}
					<h1 class="text-2xl sm:text-4xl font-bold">
						No items are out of date today.
					</h1>
				{:else if page === 'locations'}
					<h1 class="text-2xl sm:text-4xl font-bold">
						No locations on record.
					</h1>
				{:else if page === 'employees'}
					<h1 class="text-2xl sm:text-4xl font-bold">
						No employees on record.
					</h1>
				{/if}
			</div>
		</Card>
	</Card>
</div>
