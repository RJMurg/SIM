<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import Title from "$lib/Title.svelte";
    import Toasts from "$lib/Toasts.svelte";
    import { addToast } from "$lib/store.js";
    
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

    export let home = () => {
        window.location.href = "/";
    }
</script>

<head>
    <title>SIM - Add Location</title>
</head>

<Title />

<Toasts />

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button short medium" on:click={() => home()}>
                <i class="fa fa-home"></i>
                Home
            </button>
        </div>

        <form method="post">
            <label for="name">
                Location Name
                <span class="required">*</span>
            </label>
            <input type="text" name="name" placeholder="Location Name" required/>

            <button class="button short">
                <i class="fa fa-plus"></i>
                Add Location
            </button>
        </form>
    </div>
</div>