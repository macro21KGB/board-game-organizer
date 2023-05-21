import styled from 'styled-components';

const MenuButtonContainer = styled.button`
    all: unset;

    display: flex;
    flex-direction: row;

    border: 1px solid #223353;
    padding: 1rem ;
    border-radius: 9px;

    &:hover {
        background-color: #223353;
    }

    &:active {
        background-color: #1C7A6B;
    }


`;


interface MenuButtonProps {
    onClick: () => void;
}

export function MenuButton(props: MenuButtonProps) {
    return <MenuButtonContainer {...props}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" width={30}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    </MenuButtonContainer>
}