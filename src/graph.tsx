import { useCallback, useState } from "react";

function calculateWinner(squares: string[]) {
    const arrs = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < arrs.length; i++) {
        const [a, b, c] = arrs[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function Graph() {

    type playerType = "X" | "O"

    interface moveDetails {
        player: playerType | null;
        moveNumber: number;
        squareNumber: number;
    }

    const [player, setPlayer] = useState<playerType>("X");
    const [moves, setMoves] = useState<moveDetails[]>([]);
    const [buttonInfo, setButtonInfo] = useState<string[]>(Array(9).fill(""))

    const winner = calculateWinner(buttonInfo);

    const squareClicked = useCallback((squareNumber: number) => {
        if (winner || buttonInfo[squareNumber] !== "") {
            return;
        }
        
        setMoves([...moves, { player, moveNumber: moves.length + 1, squareNumber }]);
        setPlayer(player === "X" ? "O" : "X");

        setButtonInfo(buttonInfo.map((value, index) => {
            if (index === squareNumber) {
                return player;
            }
            return value;
        }));

    }, [player, buttonInfo, moves, winner]);

    const buttons = buttonInfo.map((value, index) => (
        <button
            key={index}
            onClick={() => squareClicked(index)}
            className="w-24 h-24 border border-gray-300 text-2xl font-bold text-center"
            disabled={winner ? true : false}
        >
            {value}
        </button>
    ));

    const clickHistory = (moveNumber: number) => {
        if (moveNumber === -1) {
            setPlayer("X");
            setMoves([]);
            setButtonInfo(Array(9).fill(""));
            return;
        }

        setPlayer(moves[moveNumber].player === "X" ? "O" : "X");
        const rebuiltBoard = Array(9).fill("");

        const slicedMoves = moves.slice(0, moveNumber + 1);
        setMoves(slicedMoves);
        
        slicedMoves.forEach((move) => {
            rebuiltBoard[move.squareNumber] = move.player;
        });

        setButtonInfo(rebuiltBoard);
    }

    return (
        <>
            <div className="mt-4 flex justify-center items-center flex-col">
                {winner ? `Winner: ${winner}` : `Next Player: ${player}`}

                <div className="grid grid-cols-3 gap-2 w-fit">
                    {buttons}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <div className="flex">
                            <span>1.</span>
                            <button key={0} onClick={() => clickHistory(-1)}>Go to Game Start</button>
                        </div>
                        {moves.map((move, index) => (
                            <div className="flex">
                                <span>{index + 2}.</span>
                                <button key={index + 1} onClick={() => clickHistory(index)}>Go to move #{index + 1}</button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}

export default Graph;