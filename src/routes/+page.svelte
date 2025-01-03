<script lang="ts">
	import MenuBar from '$lib/components/custom/MenuBar.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	let page = $state('home');
	let homeButtonVariant: buttonVariant = $state('default');
	let addButtonVariant: buttonVariant = $state('secondary');
	let inventoryButtonVariant: buttonVariant = $state('secondary');

	$effect(() => {
		if (page === 'home') {
			homeButtonVariant = 'default';
			addButtonVariant = 'secondary';
			inventoryButtonVariant = 'secondary';
		} else if (page === 'add') {
			homeButtonVariant = 'secondary';
			addButtonVariant = 'default';
			inventoryButtonVariant = 'secondary';
		} else if (page === 'inventory') {
			homeButtonVariant = 'secondary';
			addButtonVariant = 'secondary';
			inventoryButtonVariant = 'default';
		}
	});
</script>

<div class="h-screen w-screen p-4">
	<Card class="h-full w-full p-4">
		<div class="flex h-1/6 w-full flex-col items-center justify-center">
			<div class="flex w-full flex-row items-center justify-center">
				<img src="./sim.png" alt="SIM Logo" class="mr-4 h-auto w-12" />
				<h1 class="text-4xl font-bold">SIM</h1>
				<img src="./sim.png" alt="SIM Logo" class="ml-4 h-auto w-12" />
			</div>

			<MenuBar {homeButtonVariant} {addButtonVariant} {inventoryButtonVariant} bind:page />
		</div>

		<Card class="h-5/6 w-full">
			<div class="flex h-full flex-row items-center justify-center">
				<h1 class="text-4xl font-bold">No items are out of date today.</h1>
			</div>
		</Card>
	</Card>
</div>
