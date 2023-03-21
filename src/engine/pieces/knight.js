import * as moveHandler from "./../moveHandler.js";
import * as notation from "./../notation.js";

export function moves(piece, board, coordinates){
    let leoMoves = [];
    // Attack or walk moves
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] + 1, coordinates[1] + 2], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] - 1, coordinates[1] + 2], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] + 1, coordinates[1] - 2], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] - 1, coordinates[1] - 2], coordinates));
    
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] + 2, coordinates[1] + 1], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] + 2, coordinates[1] - 1], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] - 2, coordinates[1] + 1], coordinates));
    leoMoves = leoMoves.concat(moveHandler.walkOrAttack(board, piece, [coordinates[0] - 2, coordinates[1] - 1], coordinates));

    // Generate notations
    let possibleMoves = []
    let i;
    for(i in leoMoves){
        if(leoMoves[i].valid){
            possibleMoves.push(notation.generate(leoMoves[i], piece))
        }
    }

    return possibleMoves
}
