import * as moveHandler from "./../moveHandler.js";
import * as notation from "./../notation.js";

export function moves(piece, board, coordinates, oneRange=false){
    let leoMoves = [];

    // Attack or walk moves
    for(let i = 0; i < 4; i++){
        let yA = 0;
        let xA = 0;

        if(i == 0) yA = 1;
        if(i == 1) yA = -1;
        if(i == 2) xA = 1;
        if(i == 3) xA = -1;

        let currentCoordinates = structuredClone(coordinates);
        let collided = false;
        while(!collided){
            currentCoordinates = [currentCoordinates[0] + xA, currentCoordinates[1] + yA]
            
            let validCoordinates = moveHandler.validCoordinates(currentCoordinates)
            if(!validCoordinates) collided = true

            let leoMove = moveHandler.walkOrAttack(board, piece, currentCoordinates, coordinates);
            if(leoMove.length != 0){
                if(leoMove[0]['type'] == 'attack'){
                    collided = true
                }
            }else{
                collided = true
            }
            
            leoMoves = leoMoves.concat(leoMove)

            if(oneRange) collided = true
        }
    }

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