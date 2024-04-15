<script lang="ts">
    import type { PageData } from './$types';
    import Title from '$lib/Title.svelte';    
    export let data: PageData;

    export let home = () => {
        window.location.href = "/";
    },
    viewLocation = (id: string) => {
        window.location.href = "/view/location/" + id;
    },
    removeLocation = (id: string) => {
        let confirmation = confirm("Are you sure you want to delete this location?");
        
        if(confirmation){
            window.location.href = "/remove/location/" + id;
        }
    },
    addLocation = () => {
        window.location.href = "/location";
    }
</script>

<head>
    <title>SIM - All Locations</title>
</head>

<Title />

<div class="exterior">
    <div class="interior">
        <div class="buttons">

            <button class="button short medium" on:click={() => home()}>
                <i class="fa fa-home"></i>
                Home
            </button>

            <button class="button short medium" on:click={() => addLocation()}>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.locations as location}
                        <tr>
                            <td>{location.name}</td>
                            <td>
                                <div class="actions">
                                    <button class="action" on:click={() => viewLocation(location.id)}><i class="fa fa-gear icon-center"></i></button>
                                    <button class="action" on:click={() => removeLocation(location.id)}><i class="fa fa-times icon-center"></i></button>
                                </div>
                            </td>
                        </tr>
                    {/each}

                    {#if data.locations.length == 0}
                        <tr>
                            <td colspan="6">No locations found.</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>

    </div>
</div>