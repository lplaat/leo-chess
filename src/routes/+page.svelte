<script>
    import ChessBoard from './../components/chess-board.svelte';
    import * as leoChess from './../engine/leoChess.js';

    let board = new leoChess.Board();
</script>

<ChessBoard board={board}/>