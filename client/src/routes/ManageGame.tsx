import FilterButton from "../components/FilterButton";
import styled from "styled-components";
import InputBox from "../components/InputBox";
import WelcomePanel from "../components/WelcomePanel";
import { useEffect, useState } from "react";
import { FilterRange, Game, gameSchema } from "../utils/interface";
import { fromZodError } from 'zod-validation-error';
import { notify } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useGameToModify } from "../utils/hooks";
import { nanoid } from "nanoid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Controller from "../controller"
import { useAutoAnimate } from "@formkit/auto-animate/react";

//@ts-ignore
import imageCompression from 'browser-image-compression';

const AddGameContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    max-width: 800px;
    margin: 0 auto;

    #top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.6rem;
    }

    #buttons {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    #togglers {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

`;

const BasicButton = styled.button<{ bgcolor?: string }>`
    all: unset;

    background-color: ${props => props.bgcolor ? props.bgcolor : props.theme.green};

    padding: 0.5rem 0.5rem;

    border-radius: 7px;

    text-align: center;
    font-weight: bold;
    color: white;

    cursor: pointer;

    &:hover {
        background-color: filter(brightness(1.2));
    }

    &:active {
        background-color: filter(brightness(0.8));
    }
`;

const LabelFormControl = styled.label`
    font-family: system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.1;

    display: grid;
    grid-template-columns: 1em auto;
    gap: 0.5em;

    & > input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        background-color: white;
        margin: 0;

        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border-radius: 0.15em;
        transform: translateY(-0.075em);

        display: grid;
        place-content: center;

        &::before {
            content: "";
            width: 0.65em;
            height: 0.65em;
            border-radius: 0.15em;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em ${props => props.theme.green};
            transform-origin: center;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        }

        &:checked:before {
            transform: scale(1.2);
        }

        &:focus {
            outline: max(2px, 0.15em) solid currentColor;
            outline-offset: max(2px, 0.15em);
        }
        
        &:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
    }

`;


type FilterRangeWithName = FilterRange & { name: string };

export default function AddGameRoute() {

    const [gameName, setGameName] = useState<string>('');
    const [score, setScore] = useState<string>("");
    const [hasExtensions, setHasExtensions] = useState<boolean>(false);
    const [isExtension, setIsExtension] = useState<boolean>(false);
    const [ranges, setRanges] = useState<FilterRangeWithName[]>([]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const controller = Controller.getInstance();

    const [isModifingGame, gameToModify] = useGameToModify();

    const [parentTogglers] = useAutoAnimate();

    const addGameMutation = useMutation((data: FormData) => {
        return controller.addGame(data);
    });

    const modifiyGameMutation = useMutation((game: Game) => {
        return controller.modifyGame(game);
    })

    useEffect(() => {

        if (gameToModify) {
            setGameName(gameToModify.name);
            setScore(gameToModify.score.toString());
            setHasExtensions(gameToModify.hasExtensions);
            setIsExtension(gameToModify.isExtension);
            setRanges([
                { name: 'players', min: gameToModify.players.min, max: gameToModify.players.max },
                { name: 'playTime', min: gameToModify.playTime.min, max: gameToModify.playTime.max }
            ]);
        }

    }, [])

    const tryToAddModifyGame = () => {

        const playersRange = ranges.find(range => range.name === 'players');
        const playtimeRange = ranges.find(range => range.name === 'playTime');

        if (!playersRange || !playtimeRange) {
            notify("Please fill all the fields", "error");
            return;
        };

        const newGame: Game = {
            key: gameToModify ? gameToModify.key : nanoid(10),
            name: gameName,
            slug: gameName.toLowerCase(),
            players: {
                min: playersRange.min,
                max: playersRange.max
            },
            playTime: {
                min: playtimeRange.min,
                max: playtimeRange.max
            },
            hasExtensions,
            isExtension,
            score: parseInt(score),
            imageUrl: null,
            extensions: []
        }

        try {

            if (isModifingGame) {
                const parsedGame = gameSchema.parse(newGame);

                modifiyGameMutation.mutate(parsedGame, {
                    onSuccess: () => {
                        queryClient.invalidateQueries(["games"]);
                        notify("Game modified successfully!", "success");
                        navigate("/");
                    },
                    onError: () => {
                        notify("Can't modify the game right now!", "error");
                    }
                });

            }
            else {

                const parsedGame = gameSchema.parse(newGame);
                const formData = new FormData();

                formData.set("game", JSON.stringify(parsedGame));

                addGameMutation.mutate(formData, {
                    onSuccess: () => {
                        queryClient.invalidateQueries(["games"]);
                        notify("Game added successfully!", "success");
                        navigate("/");
                    },
                    onError: () => {
                        notify("Can't add the game right now!", "error");
                    }
                });
            }

        } catch (err: any) {
            const validationError = fromZodError(err);
            notify(validationError.message, "error");
        }


    }

    return (
        <AddGameContainer>
            <div id="top-bar">
                {
                    isModifingGame ?
                        <WelcomePanel title="Modify" subtitle={gameToModify?.name!} />
                        : <WelcomePanel title="Add" subtitle="a new game" />

                }
                <div id="buttons">
                    <BasicButton onClick={() => { tryToAddModifyGame() }} >{isModifingGame ? 'Modify the game' : 'Add the game'}</BasicButton>
                    {
                        isModifingGame &&
                        <BasicButton bgcolor="red" onClick={() => {
                            controller.removeGame(gameToModify!.key);
                            queryClient.invalidateQueries(["games"]);
                            notify("Game removed successfully!", "success");
                            navigate("/");
                        }} >Remove the game</BasicButton>
                    }
                    <BasicButton bgcolor="orange" onClick={() => { navigate("/") }} >Go Back</BasicButton>
                </div>
            </div>
            <InputBox placeholder='Name of the game' value={gameName} onChange={setGameName} />
            <FilterButton onRangeSelected={(currentRange) => {
                setRanges([
                    ...ranges,
                    {
                        ...currentRange,
                        name: 'players'
                    }
                ])
            }}
                rangeLimiters={{ min: 1, max: 30 }}
                range={gameToModify?.players}
                defaultPlaceholder='How many players?'
                unit='players'
            />
            <FilterButton onRangeSelected={(currentRange) => {
                setRanges([
                    ...ranges,
                    {
                        ...currentRange,
                        name: 'playTime'
                    }
                ])
            }}
                rangeLimiters={{ min: 5, max: 300 }}
                step={5}
                range={gameToModify?.playTime}
                defaultPlaceholder='How much time?'
                unit='minutes'
            />
            <InputBox value={score} onChange={setScore} type="number" placeholder="How much do you rate this game?" />
            <div id="togglers" ref={parentTogglers}>
                <LabelFormControl>
                    <input type="checkbox" disabled={isExtension} checked={hasExtensions} onChange={(e) => { setHasExtensions(e.target.checked) }} />
                    Has extensions?
                </LabelFormControl>
                <LabelFormControl>
                    <input type="checkbox" disabled={hasExtensions} checked={isExtension} onChange={(e) => { setIsExtension(e.target.checked) }} />
                    Is extension?
                </LabelFormControl>
            </div>

        </AddGameContainer>
    )
}