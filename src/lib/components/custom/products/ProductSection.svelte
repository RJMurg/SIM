<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { Plus } from 'lucide-svelte';

	export let products;
</script>

<div class="m-4 flex h-full w-full flex-col items-center justify-center">
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<Plus class="h-6 w-6 text-green-500" />
			Add Product
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Add Product</Dialog.Title>
				<Dialog.Description>
					Add a product to SIM that will appear when it's time to remove it from the shelves.
				</Dialog.Description>
			</Dialog.Header>
			<!-- Add expiry date, how many days early to remove it, barcode and product name -->
			<!-- They should first be prompted to scan a barcode, then they can add the product name, expiry date and how many days early to remove it. -->
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" value="Pedro Duarte" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="username" class="text-right">Username</Label>
					<Input id="username" value="@peduarte" class="col-span-3" />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<div class="flex h-full w-full flex-col items-center justify-center">
		{#if products.length == 0}
			<h1 class="text-4xl font-bold">Nothing is out of date today.</h1>
		{/if}
	</div>
</div>
