import { Piece } from './pieceHandler.js';
import * as notation from "./notation.js";
import * as moveHandler from "./moveHandler.js";

export class Board {
    constructor() {
        this.moves = [];
        this.turn = 0;
        this.positions = [
            ['b4', 'b3', 'b2', 'b5', 'b6', 'b2', 'b3', 'b4'],
            ['b1', 'b1', 'b1', 'b1', 'b1', 'b1', 'b1', 'b1'],
            ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
            ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
            ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
            ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
            ['w1', 'w1', 'w1', 'w1', 'w1', 'w1', 'w1', 'w1'],
            ['w4', 'w3', 'w2', 'w5', 'w6', 'w2', 'w3', 'w4']
        ];
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

    move(move){
        let leoMove = notation.reverseComplexNotation(this, move)[0]
        let tempBoard = moveHandler.doLeoMove(this, leoMove, move)

        this.turn = tempBoard.turn;
        this.moves = tempBoard.moves;
        this.positions = tempBoard.positions;
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