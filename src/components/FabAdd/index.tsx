import { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Modal } from '../Modal';

const FABContainer = styled.button`
    all: unset;

    position: fixed;
    bottom: 1rem;
    right: 1rem;

    background-color: ${props => props.theme.backgroundFabColor};

    width: 3.5rem;
    height: 3.5rem;

    border-radius: 50%;

    font-weight: bold;
    font-size: 2rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    &:hover {
        background-color: #D8B65F;
    }

    &:active {
        background-color: #CDAF4F;
    }



`;


export function FABAdd() {

    const [showModal, setShowModal] = useState(false);


    return (
        <>
            {showModal && createPortal(
                <Modal title='Add new Game' onClose={() => setShowModal(false)}>
                </Modal>, document.body
            )
            }
            <FABContainer onClick={() => { setShowModal(true) }}>
                +
            </FABContainer>
        </>
    )
}