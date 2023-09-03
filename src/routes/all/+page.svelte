<script lang="ts">
    import type { PageData } from './$types';
    import Title from '$lib/Title.svelte'
    
    export let data: PageData;

    export let back = () => {
        window.location.href = "/";
    },
    productView = (id: string) => {
        window.location.href = "/view/" + id;
    },
    productRemove = (id: string) => {
        window.location.href = "/remove/" + id;
    }
</script>

<head>
    <title>SIM - All Products</title>
</head>

<Title />

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button short medium" on:click={() => back()}>
                <i class="fa fa-arrow-left"></i>
                Back
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
                </tbody>
            </table>
        </div>

    </div>
</div>