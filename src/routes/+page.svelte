<script>
    import ChessBoard from './../components/chess-board.svelte';
    import * as leoChess from './../engine/leoChess.js';

    let board = new leoChess.Board();
    // board.loadFEN('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2')
</script>

<ChessBoard board={board}/>