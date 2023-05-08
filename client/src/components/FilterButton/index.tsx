import styled from "styled-components";
import { FilterRange } from "../../utils/interface";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const FilterContainer = styled.div<{ selected: boolean }>`
    all: unset;
    color: white;

    background: transparent;
    border: 1px solid #223353;
    border-radius: 9px;
    padding: 0.5rem;
    text-align: center;

    &:hover {
        background-color: #223353;
        color: white;
    }
    
    ${props => props.selected && `
        background-color: white;
        color: black;
    `
    }

    `;

const InputRangeItem = styled("input") <{ type: "range" }>`
    all: unset;

    width: 100%;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: #536484;
    margin: 0.5rem 0;
    
    &:focus {
        outline: none;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1rem;
        height: 1rem;
        border-radius: 8px;
        background-color: #223353;
        cursor: pointer;

    }

    &::-moz-range-thumb {
        width: 1rem;
        height: 1rem;   
        border-radius: 8px;
        background-color: #223353;
        cursor: pointer;

        
    }

    &::-ms-thumb {
        position: relative;
        width: 0.5rem;
        height: 1rem;
        border-radius: 8px;
        background-color: #223353;
        cursor: pointer;

        
    }

    &::-webkit-slider-runnable-track {
        width: 100%;
        height: 0.5rem;
        cursor: pointer;
        background-color: #536484;
        border-radius: 0.5rem;
    }

    &::-moz-range-track {
        width: 100%;
        height: 0.5rem;
        cursor: pointer;
        background-color: #536484;
        border-radius: 0.5rem;
    }

    &::-ms-track {
        width: 100%;
        height: 0.5rem;
        cursor: pointer;
        background-color: #536484;
        border-radius: 0.5rem;
    }

    &::-ms-tooltip {
        display: none;
    }

    &::-moz-focus-outer {
        border: 0;
    }

`;


const SearchButton = styled.button`
    background-color: ${props => props.theme.green};
    color: white;
    
    font-weight: bold;
    font-size: 1.2rem;
    
    border: none;
    padding: 0.5rem;
    border-radius: 6px;

    &:hover {
        background-color: #2A9D8F;
    }

    &:active {
        background-color: #1C7A6B;
    }
`;


const FilterOptions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0.5rem;
`;


interface FilterButtonProps {
    defaultPlaceholder: string;
    onClick?: () => void;
    range?: FilterRange;
    rangeLimiters: FilterRange;
    unit?: "players" | "minutes"
    step?: number;
    onRangeSelected?: (range: FilterRange) => void;
}


export default function FilterButton({ defaultPlaceholder, onRangeSelected, onClick, range, rangeLimiters, unit, step }: FilterButtonProps) {

    const [selectingFilter, setSelectingFilter] = useState(false);

    const [currentRange, setCurrentRange] = useState<FilterRange | undefined>(range);
    const [selectorRanges, setSelectorRanges] = useState<FilterRange>(rangeLimiters);
    const [parent] = useAutoAnimate();

    const handleClick = () => {
        onClick?.();
        setSelectingFilter(true);
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectorRanges({ ...selectorRanges, [e.target.name]: parseInt(e.target.value) });
    }

    const handleSave = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();

        if (selectorRanges.min > selectorRanges.max) {
            setSelectorRanges({ min: selectorRanges.max, max: selectorRanges.min });
        }

        setSelectingFilter(false);
        setCurrentRange(selectorRanges);
        onRangeSelected?.(selectorRanges);
    }

    return (
        <FilterContainer selected={range != null} ref={parent} onClick={handleClick}>
            {currentRange && !selectingFilter ? `${currentRange?.min} - ${currentRange?.max} ${unit ?? ""}` : defaultPlaceholder}
            {
                selectingFilter &&
                <FilterOptions >
                    <p>Min: {selectorRanges.min}</p>
                    <InputRangeItem onChange={handleFilterChange} name="min" type="range" min={rangeLimiters.min} max={rangeLimiters.max} step={step ?? 1} />
                    <p>Max: {selectorRanges.max}</p>
                    <InputRangeItem onChange={handleFilterChange} name="max" type="range" min={rangeLimiters.min} max={rangeLimiters.max} step={step ?? 1} />
                    <SearchButton onClick={handleSave}>Save</SearchButton>
                </FilterOptions>
            }
        </FilterContainer>

    )
}