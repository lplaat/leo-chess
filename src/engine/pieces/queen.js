import * as rook from "./rook.js";
import * as bishop from "./bishop.js";

export function moves(piece, board, coordinates){
    let possibleMoves = rook.moves(piece, board, coordinates)
    possibleMoves = possibleMoves.concat(bishop.moves(piece, board, coordinates))

    return possibleMoves
}
