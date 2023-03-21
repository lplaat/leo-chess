import { Piece } from './pieceHandler.js';
import * as notation from "./notation.js";
import * as moveHandler from "./moveHandler.js";

export class Board {
    constructor() {
        this.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    }

    validMoves() {
        let moves = [];

        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++){
                let pieceData = new Piece(this.positions[y][x])
                if(pieceData.id != null){
                    let pieceMoves = pieceData.findMoves(this, [x, y]);
                    moves.push({'tile': [x, y], 'moves': pieceMoves})
                }
            }
        }

        return moves;
    }

    getFenPiece(fenID){
        const pieceTypes = ['p', 'b', 'n', 'r', 'q', 'k']
        let i;
        for(i in pieceTypes){
            if(pieceTypes[i] == fenID.toLowerCase()){
                if(fenID == fenID.toUpperCase()){
                    return 'w' + (Number(i) + 1)
                }else{
                    return 'b' + (Number(i) + 1)
                }
            }
        }
    }

    loadFEN(fen){
        this.flags = {
            'enPassantTargetSquare': fen.split(' ')[3],
            'IsOffSet': 0,
            'castling': [
                [
                    fen.split(' ')[2].search('K') != -1,
                    fen.split(' ')[2].search('Q') != -1,
                ],
                [
                    fen.split(' ')[2].search('k') != -1,
                    fen.split(' ')[2].search('Q') != -1,
                ]
            ]
        }

        this.turn = 0
        if(fen.split(' ')[1] == 'b'){
            this.turn = 1;
            this.flags['IsOffSet'] = 1;
        }

        let fenBoard = fen.split(' ')[0].split('/')
        this.positions = []
        for(let y = 0; y < 8;){
            this.positions.push([])
            for(let x = 0; x < 8;){
                if(fenBoard[y][x] == undefined){
                    break
                }
                if(isNaN(fenBoard[y][x])){
                    let piece = this.getFenPiece(fenBoard[y][x])
                    this.positions[y].push(piece)
                }else{
                    for(let i = 0; i < Number(fenBoard[y][x]); i++){
                        this.positions[y].push('  ')
                    }
                }
                x++
            }
            y++
        }

        this.moves = [];
    }

    move(move){
        let leoMove = notation.reverseComplexNotation(this, move)[0]
        let tempBoard = moveHandler.doLeoMove(this, leoMove, move)

        // Disable casteling if king or rook moves
        if(move[0] == 'K' || move[0] == 'O'){
            tempBoard.flags['castling'][this.turn] = [false, false] 
        }else if(move[0] == 'R'){
            if(move[1] == 'a') tempBoard.flags['castling'][this.turn][0] = false
            if(move[1] == 'h') tempBoard.flags['castling'][this.turn][0] = false
        }

        let yLevel = this.turn * 7;
        if(move.search('x') != -1){
            if(Number(move[5]) == 8 - yLevel){
                if(move[4] == 'a') tempBoard.flags['castling'][this.turn][0] = false
                if(move[4] == 'h') tempBoard.flags['castling'][this.turn][0] = false
            }
        }

        // Copy temp board to main board
        this.turn = tempBoard.turn;
        this.moves = tempBoard.moves;
        this.positions = tempBoard.positions;
        this.flags = tempBoard.flags;
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