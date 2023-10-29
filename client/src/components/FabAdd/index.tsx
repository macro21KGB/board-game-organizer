import styled from 'styled-components';

const FABContainer = styled.button<{ backgroundfabcolor?: string }>`
    all: unset;

    position: fixed;
    bottom: 1rem;
    right: 1rem;

    background-color: ${props => props.backgroundfabcolor ?? props.theme.backgroundFabColor};

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


interface FABButtonProps {
    onClick: () => void
    backgroundFabColor?: string
    icon?: "add" | "modify" | "delete"
}

export function FABButton({ onClick, backgroundFabColor, icon = "add" }: FABButtonProps) {

    const icons = {
        add: "+",
        modify: (<svg xmlns="http://www.w3.org/2000/svg" style={{ height: "1.5rem", fontSize: "2rem", fontWeight: "bold" }} viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
        </svg>
        ),
        delete: "🗑️"
    }

    return (
        <>

            <FABContainer backgroundfabcolor={backgroundFabColor} onClick={onClick}>
                {icons[icon]} {/* 🗑️ ✏️ ➕ */}
            </FABContainer>
        </>
    )
}