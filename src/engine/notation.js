import * as data from "./pieces/data.js";
import * as moveHandler from "./moveHandler.js";

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function flipY(y){
    return (8 - y)
}

export function generatePartNotation(coordinates){
    return files[coordinates[0]] + flipY(coordinates[1])
}

export function generate(leoMove, piece){
    let pastCoordinate = leoMove['from'][0];
    let newCoordinate = leoMove['to'][0];

    if(piece['id'] == 1){
        if(leoMove['kills'].length == 0){
            return files[pastCoordinate[0]] + flipY(pastCoordinate[1]) + files[newCoordinate[0]] + flipY(newCoordinate[1])
        }else{
            return files[pastCoordinate[0]] + flipY(pastCoordinate[1]) + 'x' + files[newCoordinate[0]] + flipY(newCoordinate[1])
        }
    }else{
        if(leoMove['kills'].length == 0){
            return piece.notation + files[pastCoordinate[0]] + flipY(pastCoordinate[1]) + files[newCoordinate[0]] + flipY(newCoordinate[1])
        }else{
            return piece.notation + files[pastCoordinate[0]] + flipY(pastCoordinate[1]) + 'x' + files[newCoordinate[0]] + flipY(newCoordinate[1])
        }
    }
}

function reverseNotationPosition(nPos){
    let file = null;
    let i;
    for(i in files){
        if(files[i] == nPos[0]){
            file = i
            break
        }
    }

    return [Number(file), 8 - nPos[1]]
}

export function reverseComplexNotation(board, notation){
    let promoting;
    if(notation.search('=') != -1){
        if(notation.split('=')[1] == 'Q') promoting = 5
        if(notation.split('=')[1] == 'N') promoting = 3
        if(notation.split('=')[1] == 'R') promoting = 4
        if(notation.split('=')[1] == 'B') promoting = 2
    }else{
        promoting = null
    }

    if(notation[0] == notation[0].toUpperCase()){
        if(notation[0] != 'O'){
            let pastPos = reverseNotationPosition(notation.slice(1, 3))
            if(notation.search('x') == -1){
                let currentPos = reverseNotationPosition(notation.slice(3, 5))

                return [{'valid': true, 'from': [pastPos], 'to': [currentPos], 'promoting': promoting, 'kills': [], 'type': 'move'}]
            }else{
                let currentPos = reverseNotationPosition(notation.slice(4, 6))
                let pieceData = data.piece(board.positions[currentPos[1]][currentPos[0]])
                
                return [{'valid': true, 'from': [pastPos], 'to': [currentPos], 'promoting': promoting, 'kills': [{'coordinates': currentPos, 'data': pieceData}], 'type': 'attack'}]
            }
        }else{
            let rank;
            if(board.turn == 0){
                rank = 7
            }else{
                rank = 0
            }

            if(notation === 'O-O-O'){
                return [{'valid': true, 'from': [[0, rank], [4, rank]], 'to': [[3, rank], [2, rank]], 'promoting': promoting, 'kills': [], 'type': 'move'}]
            }else if(notation === 'O-O'){
                return [{'valid': true, 'from': [[7, rank], [4, rank]], 'to': [[5, rank], [6, rank]], 'promoting': promoting, 'kills': [], 'type': 'move'}]
            }
        }
    }else{
        let pastPos = reverseNotationPosition(notation.slice(0, 2))
        if(notation.search('x') == -1){
            let currentPos = reverseNotationPosition(notation.slice(2, 5))

            return [{'valid': true, 'from': [pastPos], 'to': [currentPos], 'promoting': promoting, 'kills': [], 'type': 'move'}]

        }else{
            let currentPos = reverseNotationPosition(notation.slice(3, 5))
            
            let isEmpty = moveHandler.isSpaceClear(board, currentPos, pastPos, true)
            if(!isEmpty[0]['valid']){
                let pieceData = data.piece(board.positions[currentPos[1]][currentPos[0]])
                return [{'valid': true, 'from': [pastPos], 'to': [currentPos], 'promoting': promoting, 'kills': [{'coordinates': currentPos, 'data': pieceData}], 'type': 'attack'}]
            }else{
                let offset;
                if(board.turn == 1) offset = -1
                if(board.turn == 0) offset = 1

                let pieceData = data.piece(board.positions[currentPos[1] + offset][currentPos[0]])
                return [{'valid': true, 'from': [pastPos], 'to': [currentPos], 'promoting': promoting, 'kills': [{'coordinates': [currentPos[0], currentPos[1] + offset], 'data': pieceData}], 'type': 'attack'}]
            }
        }
    }
}