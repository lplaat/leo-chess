import * as data from "./pieces/data.js";

export function flip(a){
    if(a < 0) return a - a - a
    return a
}

export function validCoordinates(coordinates){
    return !(coordinates[0] < 0 || coordinates[1] < 0 || coordinates[0] > 7 || coordinates[1] > 7);
}

export function isSpaceClear(board, coordinates, originalCoordinates, returnEvenFalse=false){
    let valid = validCoordinates(coordinates);

    if(valid){
        if(board.positions[coordinates[1]][coordinates[0]] != '  '){
            valid = false
        }
    }

    if(valid || returnEvenFalse){
        return [{'valid': valid, 'from': [originalCoordinates], 'to': [coordinates], 'promoting': null, 'kills': [], 'type': 'move'}];
    }else{
        return []
    }
}

export function isOpponent(board, piece, coordinates, originalCoordinates, returnEvenFalse=false){
    let valid = validCoordinates(coordinates);

    if(valid){
        if(board.positions[coordinates[1]][coordinates[0]] == '  '){
            valid = false
        }
    }

    let pieceData = null;
    if(valid){
        let pieceData = data.piece(board.positions[coordinates[1]][coordinates[0]])
        if(pieceData.type == piece.type){
            valid = false
        }
    }

    if(valid || returnEvenFalse){
        return [{'valid': valid, 'from': [originalCoordinates], 'to': [coordinates], 'promoting': null, 'kills': [{'coordinates': coordinates, 'data': pieceData}], 'type': 'attack'}]
    }else{
        return []
    }
}

export function walkOrAttack(board, piece, coordinates, originalCoordinates){
    let walk = isSpaceClear(board, coordinates, originalCoordinates, true)
    if(walk[0]['valid']) return walk

    let attack = isOpponent(board, piece, coordinates, originalCoordinates, true)
    if(attack[0]['valid']) return attack

    return []
}

export function doLeoMove(board, leoMove, move){
    let tempBoard = structuredClone(board)
    tempBoard.moves = tempBoard.moves.concat([move])

    if(tempBoard.turn == 0){tempBoard.turn = 1
    }else{tempBoard.turn = 0}


    let i;
    for(i in leoMove['kills']){
        let kill = leoMove['kills'][i]
        tempBoard.positions[kill['coordinates'][1]][kill['coordinates'][0]] = '  '
    }

    for(i = 0; i < leoMove['from'].length; i++){
        let piece = tempBoard.positions[leoMove['from'][i][1]][leoMove['from'][i][0]]

        if(leoMove['promoting'] != null){
            let pieceData = data.piece(piece)
            let newPiece;

            if(pieceData.type == 0) newPiece = 'w'
            if(pieceData.type == 1) newPiece = 'b'

            newPiece += leoMove['promoting']
            piece = newPiece
        }

        tempBoard.positions[leoMove['to'][i][1]][leoMove['to'][i][0]] = piece
        tempBoard.positions[leoMove['from'][i][1]][leoMove['from'][i][0]] = '  '
    }

    return tempBoard
}