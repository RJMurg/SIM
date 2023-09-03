<script lang="ts">
    import Title from "$lib/Title.svelte";

    export let data;
    
    // @ts-nocheck

    export let addProduct = () => {
        window.location.href = "/product";
    },
    viewAll = () => {
        window.location.href = "/all";
    },
    viewRemoved = () => {
        window.location.href = "/removed";
    },
    productRemove = (id: number) => {
        let confirmation = confirm("Are you sure you want to delete this product?");
        
        if(confirmation){
            window.location.href = "/remove/" + id;
        }
    }
</script>

<head>
    <title>SIM - Home
    </title>
</head>

<Title />

<div class="exterior" style="background-color: var(--yellow)">
    <div class="buttons">
        <button class="button short butsmall" on:click={() => addProduct()}>
            <i class="fa fa-plus"></i>
            Add New
        </button>
        <button class="button short butsmall" on:click={() => viewAll()}>
            <i class="fa fa-list"></i>
            View All
        </button>
        <button class="button short butsmall" on:click={() => viewRemoved()}>
            <i class="fa fa-minus-circle"></i>
            View Removed
        </button>
    </div>

    <div class="interior">
        {#if data.products == undefined || data.products.length == 0}
            <h1 class="title large">Nothing is out of date today.</h1>
        {:else}
            <h1 class="title large">The following products are out of date today:</h1>
            <div class="list">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Expiration Date</th>
                            <th>Removal Date</th>
                            <th>Location</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.products as product}
                            <tr>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.expiry}</td>
                                <td>{product.removal}</td>
                                <td>{product.location}</td>
                                <td>
                                    <div class="actions">
                                        <button class="action" on:click={() => productRemove(product.id)}><i class="fa fa-times icon-center"></i></button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
