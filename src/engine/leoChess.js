import { Piece } from './pieceHandler.js';
import * as king from './pieces/king.js';

import * as notation from "./notation.js";
import * as moveHandler from "./moveHandler.js";
import * as fen from "./fen.js";

export class Board {
    constructor(fenString, playAs) {
        if(fenString == undefined) fenString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
        if(playAs == undefined) playAs = 'white';

        let fenData = fen.loadFEN(fenString);

        this.moves = [];
        this.positions = fenData['positions'];
        this.turn = fenData['turn'];
        this.flags = fenData['flags'];
        this.flags['playAs'] = playAs;
    }

    rotateNumber(num){
        if(this.flags['playAs'] == 'black'){
            return 7 - num
        }
        return num
    }

    validMoves(rawMoves=false) {
        let moves = [];

        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let pieceData = new Piece(this.positions[y][x])
                if(pieceData.id != null){
                    let pieceMoves = pieceData.findMoves(this, [x, y]);
                    if(rawMoves == false){
                        moves.push({'tile': [x, y], 'moves': pieceMoves})
                    }else{
                        moves = moves.concat(pieceMoves)
                    }
                }
            }
        }

        return moves;
    }

    move(move){
        let leoMove = notation.reverseComplexNotation(this, move)[0]
        let tempBoard = moveHandler.doLeoMove(this, leoMove, move)

        // Disable castling if king or rook moves or dies
        if(move[0] == 'K' || move[0] == 'O'){
            tempBoard.flags['castling'][this.turn] = [false, false] 
        }else if(move[0] == 'R'){
            if(move[1] == 'a') tempBoard.flags['castling'][this.turn][0] = false
            if(move[1] == 'h') tempBoard.flags['castling'][this.turn][1] = false
        }

        let yLevel = this.turn * 7;
        if(move.search('x') != -1){
            if(move[5] == 8 - yLevel){
                if(move[4] == 'a') tempBoard.flags['castling'][tempBoard.turn][0] = false
                if(move[4] == 'h') tempBoard.flags['castling'][tempBoard.turn][1] = false
            }
            // Resets and incremented half move Clock
            tempBoard.flags['HalfMoveClock'] = 0;
        }else{
            tempBoard.flags['HalfMoveClock']++;
        }

        // Incremented full move counter
        if(this.turn == 1) tempBoard.flags['totalMoves']++;

        // Remember Possible En Passant Targets
        tempBoard.flags['enPassantTargetSquare'] = '-'
        if(moveHandler.flip(leoMove['from'][0][1] - leoMove['to'][0][1]) == 2){
            let pieceData = new Piece(this.positions[leoMove['from'][0][1]][leoMove['from'][0][0]])
            if(pieceData.id == 1){
                let offset;
                if(tempBoard.turn == 1) offset = -1
                if(tempBoard.turn == 0) offset = 1

                let targetY = leoMove['from'][0][1] + offset;

                tempBoard.flags['enPassantTargetSquare'] = move[0] + (8 - targetY)
            }
        }        

        // Copy temp board to main board
        this.moves = tempBoard.moves;
        this.positions = tempBoard.positions;
        this.flags = tempBoard.flags;
        this.turn = tempBoard.turn;

        // Check if its checkmate or a draw
        let validMoves = this.validMoves(true);
        if(validMoves.length == 0){
            if(king.isInCheck(this, null)){
                this.flags['won'] = this.turn
            }else{
                this.flags['won'] = 2
            }
        }
    }

    drawInstructionFromMoves(moves){
        let instructions = [];
        let i = 0;
        for(i in moves){
            let leoMove = notation.reverseComplexNotation(this, moves[i])[0]
            if(leoMove['type'] == 'move'){
                if(moves[i][0] != 'O'){
                    let j = 0;
                    for(j in leoMove['to']){
                        instructions.push({'coordinates': leoMove['to'][j], 'move': moves[i]})
                    }
                }else{
                    instructions.push({'coordinates': leoMove['to'][1], 'move': moves[i]})
                }
            }else if(leoMove['type'] == 'attack'){
                if(leoMove['kills'][0]['coordinates'][1] == leoMove['to'][0][1]){
                    let j = 0;
                    for(j in leoMove['kills']){
                        instructions.push({'coordinates': leoMove['kills'][j]['coordinates'], 'move': moves[i]})
                    }
                }else{
                    instructions.push({'coordinates': leoMove['to'][0], 'move': moves[i]})
                }
            }
        }

        return instructions
    }
}