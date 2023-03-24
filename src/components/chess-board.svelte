<script>
    import Piece from "./piece.svelte"
    import { onMount } from 'svelte';

    export let board;

    const rows = 8;
    const columns = 8;
    let rate = 1.2;
    let size = 0;
    let upscale = 1;

    let validMoves = board.validMoves();
    let showMoves = [];

    onMount(() => {
        size = 75;
        upscale = 1.5;
    })

    let promotionPossible = false;
    let promotionTile = null;
    let promotionMoves = [];
    let promotionLetter = '';
    let promotionOptions = [];

    function showPromotionOptions(){
        document.querySelector('.promotion-options').style.display = 'block';
        document.querySelector('.promotion-options').style.transform = 'translateX(' + size * board.rotateNumber(promotionTile[0]) + 'px)';
        if(board.rotateNumber(promotionTile[1]) != 0){
            document.querySelector('.promotion-options').style.transform += 'translateY(' + size * 3 + 'px)';
        }

        if(board.turn == 0) promotionLetter = 'w';
        if(board.turn == 1) promotionLetter = 'b';
            
        if(board.rotateNumber(promotionTile[1]) == 0){
            promotionOptions = [['Q', 5], ['N', 3], ['R', 4], ['B', 2], ['exist', 0]]
        }else {
            promotionOptions = [['exist', 0], ['B', 2], ['R', 4], ['N', 3], ['Q', 5]]
        }
    }

    function hidePromotionOptions(){
        document.querySelector('.promotion-options').style.display = 'none';
        promotionPossible = false;
    }

    function clickedBoard(x, y){
        let found = false;
        let clearMoves = false;
        let promotionOptions = 0;

        let i;
        for(i in showMoves){
            if(showMoves[i]['coordinates'][0] == x && showMoves[i]['coordinates'][1] == y){
                if(!promotionPossible){
                    board.move(showMoves[i]['move'])

                    board.positions = board.positions
                    validMoves = board.validMoves();

                    clearMoves = true
                    found = true
                }else{
                    promotionMoves.push(showMoves[i]['move'])
                    promotionOptions += 1
                    promotionTile = showMoves[i]['coordinates']
                }
            }
        }

        if(promotionOptions == 4){
            showPromotionOptions()
            found = true;
        }

        if(!found){
            let i;
            for(i in validMoves){
                if(validMoves[i]['tile'][0] == x && validMoves[i]['tile'][1] == y){
                    found = true
                    showMoves = board.drawInstructionFromMoves(validMoves[i]['moves'])
                    validMoves[i]['moves'].forEach(move => {
                        if(move.search('=') != -1){
                            promotionPossible = true;
                        }else{
                            hidePromotionOptions();
                        }
                    });
                }
            }
        }

        if(!found || clearMoves){
            showMoves = [];

            hidePromotionOptions()
        }
    }

    function promote(id){
        let i;
        for(i in promotionMoves){
            if(promotionMoves[i].split('=')[1] == id){
                board.move(promotionMoves[i])

                board.positions = board.positions
                validMoves = board.validMoves();
            }
        }
        hidePromotionOptions();
        showMoves = [];
    }

    function findClass(x, y){
        let i;
        for(i in showMoves){
            if(showMoves[i]['coordinates'][0] == board.rotateNumber(x) && showMoves[i]['coordinates'][1] == board.rotateNumber(y)){
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

    .promotion-options{
        position: absolute;
        flex-direction: column-reverse;
        margin: 0;
        padding: 0;
        border: 5px solid white;
        border-radius: 2%;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.5); 
    }

    .promotion-options .cell{
        background-color: white;
    }

    .promotion-options .cell:hover {
        cursor: pointer;
    }
</style>

<div class="board" style="width: {rows * size}px; width: {columns * size}px;">
    {#key showMoves}
        {#each Array(rows) as _, row}
            {#each Array(columns) as _, column}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={() => (clickedBoard(board.rotateNumber(column), board.rotateNumber(row)))} style="width: {size}px; height: {size}px;" class="cell {((row+column) % 2 == 0) ? 'even' : 'odd'} {findClass(column, row)}">
                        <Piece selector={board.positions[board.rotateNumber(row)][board.rotateNumber(column)]} upscale={upscale}/>
                    </div>
            {/each}
        {/each}
    {/key}

    <div class="promotion-options" style="display: none;">
        {#each promotionOptions as pieceID}
            {#if pieceID[1] != 0}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div 
                    class="cell" 
                    on:click={promote(pieceID[0])} 
                    style="width: {size}px; height: {size}px;"
                >
                    <Piece selector={promotionLetter + pieceID[1]} upscale={upscale}/>
                </div>
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => {
                        hidePromotionOptions()
                        showMoves = []
                    }} class="cell">
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" style="transform: scale(0.4);">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                </div>
            {/if}
        {/each}
    </div>
</div>
