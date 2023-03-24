function getFenPiece(fenID) {
    const pieceTypes = ['p', 'b', 'n', 'r', 'q', 'k']
    let i;
    for (i in pieceTypes) {
        if (pieceTypes[i] == fenID.toLowerCase()) {
            if (fenID == fenID.toUpperCase()) {
                return 'w' + (Number(i) + 1)
            } else {
                return 'b' + (Number(i) + 1)
            }
        }
    }
}

export function loadFEN(fen) {
    let flags = {
        'enPassantTargetSquare': fen.split(' ')[3],
        'totalMoves': Number(fen.split(' ')[5]),
        'HalfMoveClock': Number(fen.split(' ')[4]),
        'IsOffSet': 0,
        'won': 0,
        'castling': [
            [
                fen.split(' ')[2].search('K') != -1,
                fen.split(' ')[2].search('Q') != -1,
            ],
            [
                fen.split(' ')[2].search('k') != -1,
                fen.split(' ')[2].search('q') != -1,
            ]
        ]
    }

    let turn = 0;
    if (fen.split(' ')[1] == 'b') {
        turn = 1;
        flags['IsOffSet'] = 1;
    }

    let fenBoard = fen.split(' ')[0].split('/')
    let positions = []
    for (let y = 0; y < 8;) {
        positions.push([])
        for (let x = 0; x < 8;) {
            if (fenBoard[y][x] == undefined) {
                break
            }
            if (isNaN(fenBoard[y][x])) {
                let piece = getFenPiece(fenBoard[y][x])
                positions[y].push(piece)
            } else {
                for (let i = 0; i < Number(fenBoard[y][x]); i++) {
                    positions[y].push('  ')
                }
            }
            x++
        }
        y++
    }

    return {
        'flags': flags,
        'turn': turn,
        'positions': positions,
    }
}