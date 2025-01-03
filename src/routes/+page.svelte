<script lang="ts">
	import Card from "$lib/components/ui/card/card.svelte";


</script>

<div class="w-screen h-screen p-4">
    <Card class="w-full h-full p-4">
        <div class="flex flex-row items-center justify-center w-full h-1/6">
            <img src="./sim.png" alt="SIM Logo" class="w-12 h-auto mr-4" />
            <h1 class="text-4xl font-bold">SIM</h1>
            <img src="./sim.png" alt="SIM Logo" class="w-12 h-auto ml-4" />
        </div>

        <Card class="w-full h-5/6">
            <div class="h-full flex flex-row items-center justify-center">
                <h1 class="text-4xl font-bold">No items are out of date today.</h1>
            </div>
        </Card>
    </Card>
</div>