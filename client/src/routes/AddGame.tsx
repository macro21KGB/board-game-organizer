import FilterButton from "../components/FilterButton";
import styled from "styled-components";
import InputBox from "../components/InputBox";
import WelcomePanel from "../components/WelcomePanel";
import { useRef, useState } from "react";
import { FilterRange, Game, gameSchema } from "../utils/interface";
import { fromZodError } from 'zod-validation-error';
import { notify } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Controller from "../controller"
import { useAutoAnimate } from "@formkit/auto-animate/react";

const AddGameContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

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

const PhotoPreview = styled.img`
    width: 100%;
    max-height: 500px;
    object-fit: cover;
    border-radius: 7px;
    cursor: pointer;
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
    const photoRef = useRef<HTMLImageElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [score, setScore] = useState<string>("");
    const [hasExtensions, setHasExtensions] = useState<boolean>(false);
    const [isExtension, setIsExtension] = useState<boolean>(false);
    const [ranges, setRanges] = useState<FilterRangeWithName[]>([]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const controller = Controller.getInstance();

    const [parentTogglers] = useAutoAnimate();

    const addGameMutation = useMutation((newGame: Game) => {
        return controller.addGame(newGame);
    });

    const tryToAddGame = () => {

        const playersRange = ranges.find(range => range.name === 'players');
        const playtimeRange = ranges.find(range => range.name === 'playTime');

        if (!playersRange || !playtimeRange) {
            notify("Please fill all the fields", "error");
            return;
        };

        const newGame: Game = {
            key: nanoid(10),
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
            const parsedGame = gameSchema.parse(newGame);
            addGameMutation.mutate(parsedGame, {
                onSuccess: () => {
                    queryClient.invalidateQueries(["games"]);
                    notify("Game added successfully!", "success");
                    navigate("/");
                },
                onError: () => {
                    notify("Can't add the game right now!", "error");
                }
            });

        } catch (err: any) {
            const validationError = fromZodError(err);
            notify(validationError.message, "error");
        }


    }


    const saveAndPreviewPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (photoRef.current) {
                    photoRef.current.src = e.target?.result as string;
                    setPhoto(e.target?.result as string);
                }
            }
            reader.readAsDataURL(file);
            console.log(photo);
        }
    }

    return (
        <AddGameContainer>
            <div id="top-bar">
                <WelcomePanel title="Add" subtitle="a new game" />
                <div id="buttons">
                    <BasicButton onClick={() => { tryToAddGame() }} >Add the game</BasicButton>
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
                rangeLimiters={{ min: 1, max: 30 }} defaultPlaceholder='How many players?' unit='players' />
            <FilterButton onRangeSelected={(currentRange) => {
                setRanges([
                    ...ranges,
                    {
                        ...currentRange,
                        name: 'playTime'
                    }
                ])
            }}
                rangeLimiters={{ min: 5, max: 300 }} step={5} defaultPlaceholder='How much time?' unit='minutes' />
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

            <input type="file" name="photo" onChange={saveAndPreviewPhoto} />
            <PhotoPreview ref={photoRef} src="none" alt="preview" />
        </AddGameContainer>
    )
}