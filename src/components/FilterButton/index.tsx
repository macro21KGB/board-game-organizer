import styled from "styled-components";
import { FilterRange } from "../../utils/interface";

const FilterButtonContainer = styled.button<{ selected: boolean }>`
    all: unset;
    color: #536484;

    background: transparent;
    border: 1px solid #223353;
    border-radius: 9px;
    padding: 0.5rem;
    text-align: center;

    &:hover {
        background-color: #223353;
        color: white;
    }

    &:active {
        background-color: #536484;
    }
    
    ${props => props.selected && `
        background-color: white;
        color: black;
    `
    }

    `;

interface FilterButtonProps {
    defaultPlaceholder: string;
    onClick?: () => void;
    range?: FilterRange;
    rangeLimiters: FilterRange;
    unit?: "players" | "minutes"
    step?: number;
}

//@ts-ignore
export default function FilterButton({ defaultPlaceholder, onClick, range, rangeLimiters, unit, step }: FilterButtonProps) {

    const handleClick = () => {
        onClick?.();
    }

    return (
        <FilterButtonContainer selected={range != null} onClick={handleClick}>
            {range ? `${range?.min} - ${range?.max} ${unit ?? ""}` : defaultPlaceholder}
        </FilterButtonContainer>
    )
}