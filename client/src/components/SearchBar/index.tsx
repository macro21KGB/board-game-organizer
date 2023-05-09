import { useState } from 'react';
import styled from 'styled-components';

const OuterLayer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
`;

const SearchBarContainer = styled.div`
    display: flex;
    flex-direction: row;

    border: 1px solid #223353;
    padding: 1rem ;
    border-radius: 9px;

    & > input {
        all: unset;
        background-color: transparent;
        border: none;
        flex: 1;

        &::placeholder {
            color: #536484;
            font-size: 1rem;
        }
    }

    & > button {
        all: unset;
        font-weight: bold;
        font-size: 1.5rem;
        color: #5C75A4;
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

// const FilterContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 0.5rem;

// `;

interface SearchBarProps {
    onSearch: (search: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {

    const [value, setValue] = useState("");

    return (
        <OuterLayer >
            <SearchBarContainer>
                <input value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder='Search...' />
                {/* <button onClick={() => setIsExpanded(!isExpanded)} >{isExpanded ? '-' : '+'}</button> */}
            </SearchBarContainer>
            {/* {
                isExpanded &&
                <FilterContainer>
                    <FilterButton rangeLimiters={{ min: 1, max: 20 }} defaultPlaceholder='How many players?' unit='players' />
                    <FilterButton rangeLimiters={{ min: 5, max: 200 }} step={5} defaultPlaceholder='How much time?' unit='minutes' />
                    <FilterButton rangeLimiters={{ min: 1, max: 10 }} step={0.5} defaultPlaceholder='With a minimium personal score?' />
                </FilterContainer>
            } */}
            <SearchButton onClick={() => { onSearch(value) }}>
                Search
            </SearchButton>
        </OuterLayer>
    );

}