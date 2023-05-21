import { useState } from 'react';
import styled from 'styled-components';
import { MenuButton } from '../MenuButton';
import Drawer from '../Drawer';
import { createPortal } from 'react-dom';

const OuterLayer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
`;

const SearchBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    border: 1px solid #223353;
    padding: 1rem;
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


const SearchBarMenuContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
`;

interface SearchBarProps {
    onSearch: (search: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {

    const [value, setValue] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOnEnter = (key: string) => {
        if (key === "Enter") {
            onSearch(value)
        }
    }

    return (
        <OuterLayer >
            {menuOpen && createPortal(<Drawer onClose={() => setMenuOpen(false)} />, document.body)}
            <SearchBarMenuContainer>
                <SearchBarContainer>
                    <input onKeyDown={(e) => handleOnEnter(e.key)} value={value} onChange={(e) => setValue(e.target.value)} type="text" placeholder='Search...' />
                </SearchBarContainer>
                <MenuButton onClick={() => { setMenuOpen(true) }} />
            </SearchBarMenuContainer>
            <SearchButton onClick={() => { onSearch(value) }}>
                Search
            </SearchButton>
        </OuterLayer>
    );

}