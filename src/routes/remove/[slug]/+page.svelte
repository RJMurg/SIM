<script lang="ts">
    import type { PageData } from './$types';
    import Title from '$lib/Title.svelte'
    
    export let data: PageData;

    export let home = () => {
        history.back();
    }
</script>

<Title />

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button medium" on:click={home}>
                <i class="fa fa-arrow-left"></i>
                Back
            </button>
        </div>

        {#if data.code != 303}
        <h1>UNABLE TO REMOVE PRODUCT - {data.code}</h1>
        {data.message}
        <br>
        Press the back button to return.
        {/if}

        {#if data.code == 303}

        <h1 class="title large">Product Removed Successfully.</h1>
        If you're still here, you can go back by pressing the 'Back' button.
        {/if}
    </div>
</div>