import { useCallback, useEffect, useState } from "react";

function Graph() {

    type playerType = "X" | "O"
    type winner = playerType | null

    interface moveDetails {
        player: playerType | null;
        moveNumber: number;
        squareNumber: number;
    }

    type gameOngoing = boolean
    type boardDisabled = boolean

    const [player, setPlayer] = useState<playerType>("X");
    const [moves, setMoves] = useState<moveDetails[]>([]);
    const [winner, setWinner] = useState<winner>(null);
    const [gameOngoing, setGameOngoing] = useState<gameOngoing>(true);
    const [boardDisabled, setBoardDisabled] = useState<boardDisabled>(false);
    const [buttonInfo, setButtonInfo] = useState<string[]>(Array(9).fill(""))

    const arrs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];



    useEffect(() => {
        if (moves.length > 4) {
            const player: playerType = moves[moves.length - 1].player;
            const squares: number[] = moves.map((move) => {
                if (move.player === player) {
                    return move.squareNumber;
                }
            }
            );

            const exists = arrs.some(inner =>
                inner.every(num => squares.includes(num))
            );

            if (exists) {
                setWinner(player);
                setGameOngoing(false);
                setBoardDisabled(true);
            } else if (!exists && moves.length == 9) {
                setWinner(null);
                setGameOngoing(false);
                setBoardDisabled(true);
            } else if (!exists && boardDisabled === true) {
                setWinner(null);
                setGameOngoing(true);
                setBoardDisabled(false);
            }
        } else if (moves.length <= 4 && boardDisabled == true) {
            setWinner(null);
            setGameOngoing(true);
            setBoardDisabled(false);
        }
    }, [moves]);

    const squareClicked = useCallback((squareNumber: number) => {
        if (boardDisabled) {
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
    }, [boardDisabled, player, buttonInfo, moves]);

    const buttons = buttonInfo.map((value, index) => (
        <button
            key={index}
            onClick={() => squareClicked(index)}
            className="w-24 h-24 border border-gray-300 text-2xl font-bold text-center"
            disabled={boardDisabled}
        >
            {value}
        </button>
    ));

    const clickHistory = (moveNumber: number) => {
        if(moveNumber === -1){
            setPlayer("X");
            setMoves([]);
            setButtonInfo(Array(9).fill(""));
            return;
        }

        setPlayer(moves[moveNumber].player === "X" ? "O" : "X");
        setMoves(moves.slice(0, moveNumber+1));
        setButtonInfo(buttonInfo.map((_, index) => {
            if (index <= moves[moveNumber].squareNumber){
                return moves[index].player;
            }
            
            return "";
        }));
      
    

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