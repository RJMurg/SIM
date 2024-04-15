<script lang="ts">
    import type { PageData, ActionData} from './$types';
    import Title from "$lib/Title.svelte";
    import Toasts from "$lib/Toasts.svelte";
    import { addToast } from "$lib/store.js";
    
    export let data: PageData;
    export let form: ActionData

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
        let confirmation = confirm("Are you sure you want to delete this location?");

        if(confirmation){
            window.location.href = "/remove/" + data.location.id;
        }
    }
</script>

<Title />

<Toasts />

<head>
    <title>SIM - View {data.location.name}</title>
</head>

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
                Edit {data.location.name}
            </button>
            {/if}
        </div>

        {#if data.code == 200}
        <h1 class="title large">{data.location.name}</h1>

        <div class="buttons">
            <form method="POST">
                <input type="hidden" name="id" value={data.location.id} />

                <label for="name">
                    Name <span class="required">*</span>
                </label>
                <input type="text" name="name" value={data.location.name} {disabled} required />

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
        <h1 class="title large">Location Not Found</h1>
        <p class="text">The Location you are looking for does not exist.</p>
        {/if}
    </div>
</div>