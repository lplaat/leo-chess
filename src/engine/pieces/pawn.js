import * as moveHandler from "./../moveHandler.js";
import * as notation from "./../notation.js";

function flip(a){
    if(a < 0) return a - a - a
    return a
}

export function moves(piece, board, coordinates){
    let leoMoves = [];

    // Walk moves
    leoMoves = leoMoves.concat(moveHandler.isSpaceClear(board, [coordinates[0], coordinates[1] - (1 + (piece.type * -2))], coordinates, true));

    if(leoMoves[0]['valid']){
        if((piece.type == 0 && coordinates[1] == 6) || (piece.type == 1 && coordinates[1] == 1)){
            leoMoves = leoMoves.concat(moveHandler.isSpaceClear(board, [coordinates[0], coordinates[1] - ((1 + (piece.type * -2))) * 2], coordinates));
        }
    }

    // Attack moves
    leoMoves = leoMoves.concat(moveHandler.isOpponent(board, piece, [coordinates[0]-1, coordinates[1] - (1 + (piece.type * -2))], coordinates));
    leoMoves = leoMoves.concat(moveHandler.isOpponent(board, piece, [coordinates[0]+1, coordinates[1] - (1 + (piece.type * -2))], coordinates));

    // Check for on En passant
    if(board.moves.length != 0){
        let tempMove = board.moves[board.moves.length-1];
        if(tempMove.length == 4){
            let tempLeoMove = notation.reverseComplexNotation(board, tempMove)[0]
            let target = tempLeoMove['to'][0]
            if(flip(tempLeoMove['from'][0][1] - tempLeoMove['to'][0][1]) == 2){
                if(flip(tempLeoMove['from'][0][0] - coordinates[0]) == 1 && tempLeoMove['to'][0][1] == coordinates[1]){
                    leoMoves.push({'valid': true, 'from': [coordinates], 'to': [[coordinates[0] + (tempLeoMove['from'][0][0] - coordinates[0]), target[1] - (1 + (piece.type * -2))]], 'promoting': null, 'kills': [{'coordinates': [target[0], target[1]], 'data': null}], 'type': 'attack'})
                }
            }
        }
    }

    // Generate notations
    let possibleMoves = []
    let promotionMaterials = ['Q', 'N', 'R', 'B']
    let i;
    for(i in leoMoves){
        let basicNotation = notation.generate(leoMoves[i], piece)
        if(leoMoves[i].valid){
            if(leoMoves[i]['to'][0][1] == (piece.type*7)){
                promotionMaterials.forEach(promotionMaterial => {
                    possibleMoves.push(basicNotation + '=' + promotionMaterial)
                });
            }else{
                possibleMoves.push(basicNotation)
            }
        }
    }

    return possibleMoves
}