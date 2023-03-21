<script>
    import Piece from "./piece.svelte"
    import { onMount } from 'svelte';

    export let board;

    const rows = 8;
    const columns = 8;
    let rate = 1.5;
    let size = 0;
    let upscale = 1;

    let validMoves = board.validMoves();
    let showMoves = [];

    onMount(() => {
        size = (Math.floor((window.innerHeight / rate) / 8) + Math.floor((window.innerWidth / rate) / 8)) / 2;
        upscale = ((Math.floor(window.innerHeight / rate) + Math.floor(window.innerWidth / rate)) / 15) / 48
    })

    function clickedBoard(x, y){
        let found = false;
        let clearMoves = false

        let i;
        for(i in showMoves){
            if(showMoves[i]['coordinates'][0] == x && showMoves[i]['coordinates'][1] == y){
                board.move(showMoves[i]['move'])

                board.positions = board.positions
                validMoves = board.validMoves();

                clearMoves = true
                found = true
            }
        }

        if(!found){
            let i;
            for(i in validMoves){
                if(validMoves[i]['tile'][0] == x && validMoves[i]['tile'][1] == y){
                    found = true
                    showMoves = board.drawInstructionFromMoves(validMoves[i]['moves'])
                }
            }
        }

        if(!found || clearMoves){
            showMoves = []
        }
    }

    function findClass(x, y){
        let i;
        for(i in showMoves){
            if(showMoves[i]['coordinates'][0] == x && showMoves[i]['coordinates'][1] == y){
                return 'hint'
            }
        }
    }
</script>

<style>
    .board {
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: white;
        text-shadow: 1px 1px 1px black;
        margin: 0;
    }
    .even {
        background-color: white;
    }
    .odd {
        background-color: rgb(118, 150, 86);
    }

    .hint.even {
        background-color: rgb(221, 89, 89);
    }

    .hint.odd {
        background-color: rgb(197, 68, 79);
    }
</style>

<div class="board" style="width: {rows * size}px; width: {columns * size}px;">
    {#key showMoves}
        {#each Array(rows) as _, row}
            {#each Array(columns) as _, column}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={() => (clickedBoard(column, row))} style="width: {size}px; height: {size}px;" class="cell {((row+column) % 2 == 0) ? 'even' : 'odd'} {findClass(column, row)}">
                        <Piece selector={board.positions[row][column]} upscale={upscale}/>
                    </div>
            {/each}
        {/each}
    {/key}
</div>
