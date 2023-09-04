<script lang="ts">
    import type { PageData, ActionData} from './$types';
    import Title from "$lib/Title.svelte";
    import Toasts from "$lib/Toasts.svelte";
    import { addToast } from "$lib/store.js";
    
    export let data: PageData;
    export let form: ActionData

    let date = "";
    let removalDate = "";
    let rawDate = new Date(data.product.expiry);
    date = rawDate.toISOString().slice(0, 10);

    removalDate = data.product.Removal;

    let rawRemovalDate = new Date(date);
    // Reactively set removalDate to 1 day before date
    $: rawRemovalDate = new Date(date);
    $: rawRemovalDate.setDate(rawRemovalDate.getDate() - 1);
    $: removalDate = rawRemovalDate.toISOString().slice(0, 10);

    if(form?.code == 200){
        let productName = form?.message;
        addToast({
            message: productName + " edited successfully!",
            type: "success",
            dismissible: true,
            timeout: 5000
        });
    }
    else if(form?.code == 500){
        addToast({
            message: form?.message,
            type: "error",
            dismissible: true,
            timeout: 5000
        });
    }

    let disabled = true;

    let toggleEdit = () => {
        disabled = !disabled;
    }

    export let home = () => {
        history.back();
    },
    removeProduct = () => {
        let confirmation = confirm("Are you sure you want to delete this product?");

        if(confirmation){
            window.location.href = "/remove/" + data.product.id;
        }
    }
</script>

<Title />

<Toasts />

<div class="exterior">
    <div class="interior">
        <div class="buttons">
            <button class="button short medium" on:click={() => home()}>
                <i class="fa fa-arrow-left"></i>
                Back
            </button>

            {#if data.code == 200}
            <button class="button short medium" on:click={() => toggleEdit()}>
                <i class="fa fa-wrench"></i>
                Edit {data.product.name}
            </button>
            {/if}
        </div>

        {#if data.code == 200}
        <h1 class="title large">{data.product.name}</h1>

        <div class="buttons">
            <form method="POST">
                <input type="hidden" name="id" value={data.product.id} />

                <label for="name">
                    Name <span class="required">*</span>
                </label>
                <input type="text" name="name" id="name" value={data.product.name} required {disabled}/>

                <label for="quantity">
                    Quantity <span class="required">*</span>
                </label>
                <input type="number" name="quantity" id="quantity" value="1" required {disabled}/>

                <label for="location">
                    Location <span class="required">*</span>
                </label>
                <select name="location" required {disabled}>
                    {#each data.locations as location}
                    <option value={location.id}>{location.name}</option>
                    {/each}
                </select>

                <label for="expiry">
                    Expiry Date
                    <span class="required">*</span>
                </label>
                <input type="date" name="expiry" id="expiry" bind:value={date} required {disabled}/>

                <label for="remove">
                    Removal Date
                    <span class="required">*</span>
                </label>
                <input type="date" name="remove" id="remove" required bind:value={removalDate} {disabled}/>


                <div class="buttons">
                    <button class="button" {disabled}>
                        <i class="fa fa-save"></i>
                        Confirm Edit
                    </button>

                    <button class="button" on:click={() => removeProduct()} {disabled} type="button">
                        <i class="fa fa-trash"></i>
                        Delete Product
                    </button>
                </div>
            </form>
        </div>
        {/if}

        {#if data.code == 500}
        <h1 class="title large">Product Not Found</h1>
        <p class="text">The product you are looking for does not exist.</p>
        {/if}
    </div>
</div>