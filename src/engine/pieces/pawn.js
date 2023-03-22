import * as moveHandler from "./../moveHandler.js";
import * as notation from "./../notation.js";

function take(board, piece, coordinates, originalCoordinates){
    let leoMoves = [moveHandler.isOpponent(board, piece, coordinates, originalCoordinates, true)[0]]

    // Check for on En passant
    if(notation.generatePartNotation(coordinates) == board.flags['enPassantTargetSquare']){
        let valid = true;
        if(board.flags['enPassantTargetSquare'][1] == 3){
            if(piece.type != 1) valid = false
        }else if(board.flags['enPassantTargetSquare'][1] == 6){
            if(piece.type != 0) valid = false
        }

        if(valid){
            let offset;
            if(board.turn == 1) offset = 1
            if(board.turn == 0) offset = -1

            leoMoves.push({'valid': true, 'from': [originalCoordinates], 'to': [coordinates], 'promoting': null, 'kills': [{'coordinates': [coordinates[0], coordinates[1] + offset], 'data': null}], 'type': 'attack'})
        }
    }

    return leoMoves
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
    leoMoves = leoMoves.concat(take(board, piece, [coordinates[0]-1, coordinates[1] - (1 + (piece.type * -2))], coordinates));
    leoMoves = leoMoves.concat(take(board, piece, [coordinates[0]+1, coordinates[1] - (1 + (piece.type * -2))], coordinates));

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