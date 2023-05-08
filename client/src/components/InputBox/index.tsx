import styled from 'styled-components';

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

interface InputBoxProps {
    placeholder: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function InputBox({ placeholder, type, value, onChange }: InputBoxProps) {
    return (
        <SearchBarContainer>
            <input value={value} onChange={(e) => onChange(e.target.value)} type={type ?? "text"} placeholder={placeholder} />
        </SearchBarContainer>
    )
}