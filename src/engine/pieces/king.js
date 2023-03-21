import * as rook from "./rook.js";
import * as bishop from "./bishop.js";
import * as notation from "./../notation.js";
import * as moveHandler from "./../moveHandler.js";
import * as pieceHandler from "./../pieceHandler.js";

function checkIfPositionIsDecked(board, moveToCoordinate){
    let tempBoard = structuredClone(board);
    let kingPos = [0, 0];
    let kingData = null;

    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            let pieceData = new pieceHandler.Piece(tempBoard.positions[y][x])
            if(pieceData['id'] == 6){
                if(pieceData['type'] == board.turn){
                    kingPos = [x, y]
                    kingData = pieceData
                }
            }
        }
    }

    let isPosInValid = false;
    let isDecked = true;

    let leoMove = moveHandler.isSpaceClear(tempBoard, moveToCoordinate, kingPos, true)[0]
    if(!leoMove['valid']){
        isPosInValid = true
    }else{
        let tempNotation = notation.generate(leoMove, kingData)
        isDecked = isInCheck(tempBoard, tempNotation)
    }

    return [isPosInValid, isDecked]
}

export function moves(piece, board, coordinates, noCastlingCheck=false){
    // Walk or Attack moves
    let possibleMoves = rook.moves(piece, board, coordinates, true)
    possibleMoves = possibleMoves.concat(bishop.moves(piece, board, coordinates, true))

    // Check for castling
    if(!noCastlingCheck){
        let kingMoved = false;
        let rookQueenSideMoved = false;
        let rookKingSideMoved = false;
        let inCheck = isInCheck(board, null);

        let i;
        for(i in board.moves){
            if(i % 2 == board.turn){
                if(board.moves[i][0] == 'K' || board.moves[i][0] == 'O'){
                    kingMoved = true;
                }else if(board.moves[i][0] == 'R'){
                    if(board.moves[i][1] == 'A') rookQueenSideMoved = true;
                    if(board.moves[i][1] == 'H') rookQueenSideMoved = true;
                }
            }
            if(board.moves[i].search('x') != -1){
                if(Number(board.moves[i][5]) == (i % 2) * 8){
                    if(board.moves[i][4] == 'A') rookQueenSideMoved = true;
                    if(board.moves[i][4] == 'H') rookQueenSideMoved = true;
                }
            }

            i += 1
        }

        if(!kingMoved && !inCheck){
            if(!rookQueenSideMoved){
                let valid = true;
                for(let i = 0 ; i < 2; i++){
                    if(valid){
                        let check = checkIfPositionIsDecked(board, [coordinates[0] - (i + 1), coordinates[1]])
                        if(check[0] || check[1]) valid = false
                    }
                }
                
                if(valid){
                    let isTaken = checkIfPositionIsDecked(board, [coordinates[0] - 3, coordinates[1]])[0]
                    if(!isTaken){
                        possibleMoves.push('O-O-O')
                    }
                }
            }

            if(!rookKingSideMoved){
                let valid = true;
                for(let i = 0 ; i < 2; i++){
                    if(valid){
                        let check = checkIfPositionIsDecked(board, [coordinates[0] + (i + 1), coordinates[1]])
                        if(check[0] || check[1]) valid = false
                    }
                }
                if(valid){
                    possibleMoves.push('O-O')
                }
            }
        }
    }

    return possibleMoves
}

export function isInCheck(board, move){
    let tempBoard;
    if(move != null){
        let leoMove = notation.reverseComplexNotation(board, move);
        tempBoard = moveHandler.doLeoMove(board, leoMove[0], move)
    }else{
        tempBoard = structuredClone(board)
        if(tempBoard.turn == 0){tempBoard.turn = 1
        }else{tempBoard.turn = 0}
    }
    let check = false;

    for(let y = 0; y < 8; y++){
        for(let x = 0; x < 8; x++){
            let pieceData = new pieceHandler.Piece(tempBoard.positions[y][x])
            if(pieceData['id'] != null){
                let possibleMoves = pieceData.findMoves(tempBoard, [x, y], true)
                
                let i;
                for(i in possibleMoves){
                    let tempLeoMove = notation.reverseComplexNotation(tempBoard, possibleMoves[i])[0];
                    if(tempLeoMove['type'] == 'attack'){
                        if(tempLeoMove['kills'][0]['data']['id'] == 6){
                            check = true
                        }
                    }
                }
            }
        }
    }

    return check;
}
