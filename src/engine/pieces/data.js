export function piece(strID){
    let data =  {}
    if(strID != '  '){
        if(strID[0] == 'w'){
            data.type = 0;
        }else if (strID[0] == 'b'){
            data.type = 1;
        }

        data.id = Number(strID[1])
        switch(data.id) {
            case 1:
                data.name = 'pawn';
                data.points = 1;
                data.notation = null;
                break;
            case 2:
                data.name = 'bishop';
                data.notation = 'B';
                data.points = 3;
                break;
            case 3:
                data.name = 'knight';
                data.notation = 'N';
                data.points = 3;
                break;
            case 4:
                data.name = 'rook';
                data.notation = 'R';
                data.points = 5;
                break;
            case 5:
                data.name = 'queen';
                data.notation = 'Q';
                data.points = 9;
                break;
            case 6:
                data.name = 'king';
                data.notation = 'K';
                data.points = null;
                break;
          } 
    }else{
        data.id = null;
    }

    return data
}