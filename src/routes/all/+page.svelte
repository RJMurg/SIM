<script lang="ts">
    import type { PageData } from './$types';
    import Title from '$lib/Title.svelte';    
    export let data: PageData;

    export let home = () => {
        window.location.href = "/";
    },
    productView = (id: string) => {
        window.location.href = "/view/product/" + id;
    },
    productRemove = (id: string) => {
        let confirmation = confirm("Are you sure you want to delete this product?");
        
        if(confirmation){
            window.location.href = "/remove/product/" + id;
        }
    },
    addProduct = () => {
        window.location.href = "/product";
    }
</script>

<head>
    <title>SIM - All Products</title>
</head>

<Title />

<div class="exterior">
    <div class="interior">
        <div class="buttons">

            <button class="button short medium" on:click={() => home()}>
                <i class="fa fa-home"></i>
                Home
            </button>

            <button class="button short medium" on:click={() => addProduct()}>
                <i class="fa fa-plus"></i>
                Add New
            </button>
        </div>

        <!--As Table-->
        <div class="list">
            <div class="buttons">

            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Expiration Date</th>
                        <th>Removal Date</th>
                        <th>Location</th>
                        <th>Actions</th>
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
                                    <button class="action" on:click={() => productView(product.id)}><i class="fa fa-gear icon-center"></i></button>
                                    <button class="action" on:click={() => productRemove(product.id)}><i class="fa fa-times icon-center"></i></button>
                                </div>
                            </td>
                        </tr>
                    {/each}

                    {#if data.products.length == 0}
                        <tr>
                            <td colspan="6">No products found.</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>

    </div>
</div>