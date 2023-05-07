import styled from 'styled-components';

interface ModalProps {
    children: React.ReactNode;
    title: string;
    onClose: () => void;

}

const OuterBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);

    display: flex;

    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    position: relative;
    background-color: ${props => props.theme.backgroundCardColor};
    border-radius: 9px;
    padding: 1rem;
    width: 80vw;
    min-height: 50vh;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > #close-button {
        all: unset;
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.5rem 1rem;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
`;

const CloseButton = styled.button`
    all: unset;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
}
`;


export function Modal({ children, title, onClose }: ModalProps) {

    return (
        <OuterBackground>
            <ModalContainer>
                <h1>{title}</h1>
                {children}
                <CloseButton onClick={onClose}>
                    Close
                </CloseButton>
            </ModalContainer>
        </OuterBackground>
    );
}