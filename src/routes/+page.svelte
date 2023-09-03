<script lang="ts">
    import type { PageData } from './$types';
    import Title from "$lib/Title.svelte";

    export let data: PageData;
    
    // @ts-nocheck

    export let addProduct = () => {
        window.location.href = "/product";
    },
    viewAll = () => {
        window.location.href = "/all";
    },
    viewRemoved = () => {
        window.location.href = "/removed";
    }
</script>

<head>
    <title>SIM - Home
    </title>
</head>

<Title />

<div class="exterior" style="background-color: var(--yellow)">
    <div class="buttons">
        <button class="button short" on:click={() => addProduct()}>
            <i class="fa fa-plus"></i>
            Add New
        </button>
        <button class="button short" on:click={() => viewAll()}>
            <i class="fa fa-list"></i>
            View All
        </button>
        <button class="button short" on:click={() => viewRemoved()}>
            <i class="fa fa-minus-circle"></i>
            View Removed
        </button>
    </div>

    <div class="interior">

    </div>
</div>
