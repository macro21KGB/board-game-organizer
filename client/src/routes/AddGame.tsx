import FilterButton from "../components/FilterButton";
import styled from "styled-components";
import InputBox from "../components/InputBox";
import WelcomePanel from "../components/WelcomePanel";
import { useRef, useState } from "react";
import { FilterRange, Game, gameSchema } from "../utils/interface";
import { fromZodError } from 'zod-validation-error';
import { notify } from "../utils/utils";
import { useNavigate } from "react-router-dom";

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

`;

const BasicButton = styled.button<{ bgColor?: string }>`
    all: unset;

    background-color: ${props => props.bgColor ? props.bgColor : props.theme.green};

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
`;

type FilterRangeWithName = FilterRange & { name: string };

export default function AddGameRoute() {

    const [gameName, setGameName] = useState<string>('');
    const photoRef = useRef<HTMLImageElement | null>(null);
    const [photo, setPhoto] = useState<string | null>(null);
    const [score, setScore] = useState<string>("");
    const [hasExtensions] = useState<boolean>(false);
    const [ranges, setRanges] = useState<FilterRangeWithName[]>([]);

    const navigate = useNavigate();

    const tryToAddGame = () => {

        const playersRange = ranges.find(range => range.name === 'players');
        const playtimeRange = ranges.find(range => range.name === 'playTime');

        if (!playersRange || !playtimeRange) {
            notify("Please fill all the fields", "error");
            return;
        };

        const newGame: Game = {
            id: 12,
            name: gameName,
            players: {
                min: playersRange.min,
                max: playersRange.max
            },
            playTime: {
                min: playtimeRange.min,
                max: playtimeRange.max
            },
            hasExtensions,
            score: parseInt(score),
            imageUrl: photo,
            isExtension: false,
            extensions: []
        }

        try {
            const parsedGame = gameSchema.parse(newGame);
            notify("Game added successfully", "success")
            navigate('/');
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
                if (!photoRef.current) return;
                setPhoto(e.target?.result as string);
                photoRef.current.src = e.target?.result as string;
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <AddGameContainer>
            <div id="top-bar">
                <WelcomePanel title="Add" subtitle="a new game" />
                <div id="buttons">
                    <BasicButton onClick={() => { tryToAddGame() }} >Add the game</BasicButton>
                    <BasicButton bgColor="orange" onClick={() => { navigate("/") }} >Go Back</BasicButton>
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
            <input type="file" onChange={saveAndPreviewPhoto} />
            <PhotoPreview ref={photoRef} src="none" alt="preview" />
        </AddGameContainer>
    )
}