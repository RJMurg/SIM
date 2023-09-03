<script lang="ts">
    import type { PageData } from './$types';
    import Title from '$lib/Title.svelte';    
    export let data: PageData;

    export let home = () => {
        window.location.href = "/";
    }
</script>

<head>
    <title>SIM - All Removed</title>
</head>

<Title />

<div class="exterior">
    <div class="interior">
        <div class="left">
            <button class="button short medium" on:click={() => home()}>
                <i class="fa fa-home"></i>
                Home
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
                        <th>Time Removed</th>
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
                            <td>{product.removed}</td>
                        </tr>
                    {/each}

                    {#if data.products.length == 0}
                        <tr>
                            <td colspan="6">No products have been removed yet.</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>

    </div>
</div>