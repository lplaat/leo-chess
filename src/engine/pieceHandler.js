import * as data from "./pieces/data.js";

import * as pawn from "./pieces/pawn.js";
import * as bishop from "./pieces/bishop.js";
import * as knight from "./pieces/knight.js";
import * as rook from "./pieces/rook.js";
import * as queen from "./pieces/queen.js";
import * as king from "./pieces/king.js";

export class Piece {
    constructor(strID) {
        let pieceData = data.piece(strID);

        this.name = pieceData.name;
        this.notation = pieceData.notation;
        this.points = pieceData.points;
        this.type = pieceData.type;
        this.id = pieceData.id;
    }

    findMoves(board, coordinates, noKingCheck=false){
        let moves = [];

        if(this.type == board.turn){
            if(this.id == 1){
                moves = moves.concat(pawn.moves(this, board, coordinates));
            }else if(this.id == 2){
                moves = moves.concat(bishop.moves(this, board, coordinates));
            }else if(this.id == 3){
                moves = moves.concat(knight.moves(this, board, coordinates));
            }else if(this.id == 4){
                moves = moves.concat(rook.moves(this, board, coordinates));
            }else if(this.id == 5){
                moves = moves.concat(queen.moves(this, board, coordinates));
            }else if(this.id == 6){
                moves = moves.concat(king.moves(this, board, coordinates, noKingCheck));
            }
        }

        if(!noKingCheck){
            let legalMoves = [];

            let i;
            for(i in moves){
                let inCheck = king.isInCheck(board, moves[i])
                if(!inCheck){
                    legalMoves.push(moves[i])
                }
            }

            return legalMoves
        }else{
            return moves
        }
    }
}
