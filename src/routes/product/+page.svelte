<script lang="ts">
    import type { PageData, ActionData } from './$types';
    
    export let data: PageData;
    export let form: ActionData;

    let rawDate = new Date();
    let date = rawDate.toISOString().slice(0, 10);

    let rawRemovalDate = new Date(date);
    let removalDate = "";

    // Reactively set removalDate to 1 day before date
    $: rawRemovalDate = new Date(date);
    $: rawRemovalDate.setDate(rawRemovalDate.getDate() - 1);
    $: removalDate = rawRemovalDate.toISOString().slice(0, 10);

    if(form?.success) {
        window.location.href = "/";
    }

    export let back = () => {
        window.location.href = "/";
    }
</script>

<h1 class="title large text">SIM</h1>
<h2 class="subtitle medium text">A Shop Inventory Management System</h2>

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button short medium" on:click={back()}>
                <i class="fa fa-arrow-left"></i>
                Back
            </button>
        </div>

        <form method="post">
            <label for="name">Product Name</label>
            <input type="text" name="name" placeholder="Product Name"/>

            <label for="quantity">Quantity</label>
            <input type="number" name="quantity" placeholder="Quantity"/>

            <label for="Expiry">Expiry Date</label>
            <input type="date" name="expiry" placeholder="Expiry Date" bind:value={date}/>

            <label for="removal">Removal Date</label>
            <input type="date" name="removal" placeholder="Remove on what date" bind:value={removalDate}/>

            <label for="location">Location</label>
            <select name="location">
                {#each data.locations as location}
                    <option value={location.id}>{location.name}</option>
                {/each}
            </select>

            <button class="button short">
                <i class="fa fa-plus"></i>
                Add Product
            </button>
        </form>

        {#if form?.success}
            <div class="success">
                <p>Product added successfully!</p>
            </div>
        {/if}
    </div>
</div>