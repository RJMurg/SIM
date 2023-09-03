<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import Title from "$lib/Title.svelte";
    import Toasts from "$lib/Toasts.svelte";
    import { addToast } from "$lib/store.js";
    
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

    if (form?.code == 200) {
        let productName = form?.message;
        addToast({
            message: productName + " added successfully!",
            type: "success",
            dismissible: true,
            timeout: 5000
        });
    }
    else if (form?.code == 500) {
        addToast({
            message: form?.message,
            type: "error",
            dismissible: true,
            timeout: 5000
        });
    }

    export let back = () => {
        window.location.href = "/";
    }
</script>

<head>
    <title>SIM - Add Product</title>
</head>

<Title />

<Toasts />

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button short medium" on:click={() => back()}>
                <i class="fa fa-arrow-left"></i>
                Back
            </button>
        </div>

        <form method="post">
            <label for="name">
                Product Name
                <span class="required">*</span>
            </label>
            <input type="text" name="name" placeholder="Product Name" required/>

            <label for="quantity">
                Quantity
                <span class="required">*</span>
            </label>
            <input type="number" name="quantity" placeholder="Quantity" required/>

            <label for="Expiry">
                Expiry Date
                <span class="required">*</span>
            </label>
            <input type="date" name="expiry" placeholder="Expiry Date" bind:value={date} required/>

            <label for="removal">
                Removal Date
                <span class="required">*</span>
            </label>
            <input type="date" name="removal" placeholder="Remove on what date" bind:value={removalDate} required/>

            <label for="location">
                Location
                <span class="required">*</span>
            </label>
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
    </div>
</div>