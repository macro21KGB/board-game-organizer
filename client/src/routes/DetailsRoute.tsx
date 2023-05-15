import { Link, useLoaderData, useNavigate } from "react-router-dom"
import { Game } from "../utils/interface";
import styled from "styled-components";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Controller from "../controller";
import { toast } from "react-toastify";
import { FABButton } from "../components/FabAdd";

const DetailContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    #pills {
        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        flex-wrap: wrap;
    }

    #name-back {
        display: flex;
        flex-direction: row;
        gap: 0.6rem;
        align-items: flex-start;
        justify-content: space-between;

        button {
            all: unset;
            cursor: pointer;    
            margin: 0;

            svg {
                height: 1.5rem;
                margin-top: 0.2rem;
            }
        }
    }
`;

const PillContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.6rem;
    background-color: rgb(26, 50, 99);

    border-radius: 10px;

    min-width: 100px;
    padding: 0.5rem 0.5rem;

    justify-content: center;
    align-items: center;

    `;

const ExtensionBadge = styled.div`
    
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    color: white;
    background-color: #334B7E;

    padding: 0.5rem 0.5rem;
    font-weight: bold;
    
    border-radius: 0 8px 0 8px;

`;

const ExtensionSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;

    a {
        text-decoration: none;
        color: white;
        background-color: #334B7E;
        padding: 0.5rem 0.5rem;
        border-radius: 8px;
        text-align: center;
        font-weight: bold;
    }
`;


const BasicButton = styled.button<{ bgcolor?: string }>`
    all: unset;

    background-color: ${props => props.bgcolor ? props.bgcolor : props.theme.green};

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

export default function DetailRoute() {

    const game = useLoaderData() as Game;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const goBack = () => {
        navigate(-1);
    }

    const [isAddingExtension, setIsAddingExtension] = useState(false);
    const [extensionId, setExtensionId] = useState("");

    const controller = Controller.getInstance();

    const allExtensionsQuery = useQuery(["allExtensions"], () => {
        return controller.getAllExtensions();
    }, {
        enabled: isAddingExtension
    })

    const addExtensionMutation = useMutation((extensionId: string) => {
        return controller.addExtension(game.key, extensionId)
    }, {
        onSuccess: () => {
            toast.success("Extension added");
            setIsAddingExtension(false);
            queryClient.invalidateQueries(["games"]);
        },
        onError: (error: any) => {
            toast.error(error.message);
        }

    });

    const addExtensionToGame = (extensionId: string) => {
        if (extensionId === "") {
            toast.error("Please select an extension");
            return;
        }

        addExtensionMutation.mutate(extensionId);
    }

    const { playTime, players, name, extensions, isExtension, hasExtensions } = game;

    const gotToModify = () => {
        navigate(`/add`, { state: { game } });
    }

    return (
        <DetailContainer>
            <FABButton onClick={gotToModify} backgroundFabColor="orange" icon="modify" />
            <div>
                <div id="name-back">
                    <h1>{name}</h1>
                    <button onClick={() => goBack()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                    </button>
                    {
                        isExtension &&
                        <ExtensionBadge>Extension</ExtensionBadge>
                    }
                </div>
                <small><i>{game.slug}</i></small>
            </div>

            <div id="pills">
                <PillContainer>
                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.832 8.80501C2.28948 9.6188 1.99999 10.575 2 11.553V12.25C2 12.5152 1.89464 12.7696 1.70711 12.9571C1.51957 13.1447 1.26522 13.25 1 13.25C0.734784 13.25 0.48043 13.1447 0.292893 12.9571C0.105357 12.7696 0 12.5152 0 12.25V11.553C0 10.18 0.406 8.83801 1.168 7.69501L2.832 8.80501Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.80303 7.75C4.01103 7.75 3.27103 8.146 2.83203 8.805L1.16803 7.695C1.56704 7.09667 2.10758 6.60609 2.74169 6.26679C3.3758 5.9275 4.08386 5.74998 4.80303 5.75H5.00003C5.26525 5.75 5.5196 5.85536 5.70714 6.04289C5.89467 6.23043 6.00003 6.48478 6.00003 6.75C6.00003 7.01522 5.89467 7.26957 5.70714 7.45711C5.5196 7.64464 5.26525 7.75 5.00003 7.75H4.80303ZM7.01403 8.805C7.55703 9.618 7.84603 10.575 7.84603 11.553V12.25C7.84603 12.5152 7.95139 12.7696 8.13892 12.9571C8.32646 13.1446 8.58081 13.25 8.84603 13.25C9.11125 13.25 9.3656 13.1446 9.55314 12.9571C9.74067 12.7696 9.84603 12.5152 9.84603 12.25V11.553C9.84607 10.1799 9.43966 8.83751 8.67803 7.695L7.01403 8.805Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.04301 7.75C5.83501 7.75 6.57501 8.146 7.01401 8.805L8.67801 7.695C8.279 7.09667 7.73845 6.60609 7.10435 6.26679C6.47024 5.9275 5.76218 5.74998 5.04301 5.75H4.84601C4.58079 5.75 4.32644 5.85536 4.1389 6.04289C3.95137 6.23043 3.84601 6.48478 3.84601 6.75C3.84601 7.01522 3.95137 7.26957 4.1389 7.45711C4.32644 7.64464 4.58079 7.75 4.84601 7.75H5.04301Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.84601 5C5.17753 5 5.49547 4.8683 5.72989 4.63388C5.96431 4.39946 6.09601 4.08152 6.09601 3.75C6.09601 3.41848 5.96431 3.10054 5.72989 2.86612C5.49547 2.6317 5.17753 2.5 4.84601 2.5C4.51449 2.5 4.19655 2.6317 3.96212 2.86612C3.7277 3.10054 3.59601 3.41848 3.59601 3.75C3.59601 4.08152 3.7277 4.39946 3.96212 4.63388C4.19655 4.8683 4.51449 5 4.84601 5ZM4.84601 7C5.70796 7 6.53461 6.65759 7.1441 6.0481C7.7536 5.4386 8.09601 4.61195 8.09601 3.75C8.09601 2.88805 7.7536 2.0614 7.1441 1.4519C6.53461 0.84241 5.70796 0.5 4.84601 0.5C3.98405 0.5 3.1574 0.84241 2.54791 1.4519C1.93842 2.0614 1.59601 2.88805 1.59601 3.75C1.59601 4.61195 1.93842 5.4386 2.54791 6.0481C3.1574 6.65759 3.98405 7 4.84601 7ZM10.082 12.055C9.53949 12.8688 9.25 13.825 9.25001 14.803V15.5C9.25001 15.7652 9.14465 16.0196 8.95712 16.2071C8.76958 16.3946 8.51522 16.5 8.25001 16.5C7.98479 16.5 7.73044 16.3946 7.5429 16.2071C7.35537 16.0196 7.25001 15.7652 7.25001 15.5V14.803C7.25001 13.43 7.65601 12.088 8.41801 10.945L10.082 12.055ZM12.053 11C11.261 11 10.521 11.396 10.082 12.055L8.41801 10.945C8.81702 10.3467 9.35756 9.85608 9.99167 9.51679C10.6258 9.1775 11.3338 8.99998 12.053 9H12.25C12.5152 9 12.7696 9.10536 12.9571 9.29289C13.1447 9.48043 13.25 9.73478 13.25 10C13.25 10.2652 13.1447 10.5196 12.9571 10.7071C12.7696 10.8946 12.5152 11 12.25 11H12.053ZM14.264 12.055C14.807 12.868 15.096 13.825 15.096 14.803V15.5C15.096 15.7652 15.2014 16.0196 15.3889 16.2071C15.5764 16.3946 15.8308 16.5 16.096 16.5C16.3612 16.5 16.6156 16.3946 16.8031 16.2071C16.9907 16.0196 17.096 15.7652 17.096 15.5V14.803C17.096 13.4299 16.6896 12.0875 15.928 10.945L14.264 12.055Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.293 11C13.085 11 13.825 11.396 14.264 12.055L15.928 10.945C15.529 10.3467 14.9885 9.85609 14.3543 9.51679C13.7202 9.1775 13.0122 8.99998 12.293 9H12.096C11.8308 9 11.5764 9.10536 11.3889 9.29289C11.2014 9.48043 11.096 9.73478 11.096 10C11.096 10.2652 11.2014 10.5196 11.3889 10.7071C11.5764 10.8946 11.8308 11 12.096 11H12.293Z" fill="white" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.096 8.25C12.4275 8.25 12.7455 8.1183 12.9799 7.88388C13.2143 7.64946 13.346 7.33152 13.346 7C13.346 6.66848 13.2143 6.35054 12.9799 6.11612C12.7455 5.8817 12.4275 5.75 12.096 5.75C11.7645 5.75 11.4465 5.8817 11.2121 6.11612C10.9777 6.35054 10.846 6.66848 10.846 7C10.846 7.33152 10.9777 7.64946 11.2121 7.88388C11.4465 8.1183 11.7645 8.25 12.096 8.25ZM12.096 10.25C12.958 10.25 13.7846 9.90759 14.3941 9.2981C15.0036 8.6886 15.346 7.86195 15.346 7C15.346 6.13805 15.0036 5.3114 14.3941 4.7019C13.7846 4.09241 12.958 3.75 12.096 3.75C11.2341 3.75 10.4074 4.09241 9.79791 4.7019C9.18842 5.3114 8.84601 6.13805 8.84601 7C8.84601 7.86195 9.18842 8.6886 9.79791 9.2981C10.4074 9.90759 11.2341 10.25 12.096 10.25Z" fill="white" />
                    </svg>
                    {`${players.min} - ${players.max} players`}
                </PillContainer>
                <PillContainer>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 10.675L13.25 12.925C13.4333 13.1083 13.525 13.3377 13.525 13.613C13.525 13.8883 13.4333 14.1257 13.25 14.325C13.05 14.525 12.8123 14.625 12.537 14.625C12.2617 14.625 12.0243 14.525 11.825 14.325L9.3 11.8C9.2 11.7 9.125 11.5873 9.075 11.462C9.025 11.3367 9 11.2077 9 11.075V7.5C9 7.21667 9.096 6.979 9.288 6.787C9.48 6.595 9.71733 6.49933 10 6.5C10.2833 6.5 10.521 6.596 10.713 6.788C10.905 6.98 11.0007 7.21733 11 7.5V10.675ZM10 4.5C9.71667 4.5 9.479 4.404 9.287 4.212C9.095 4.02 8.99933 3.78267 9 3.5V2.5H11V3.5C11 3.78333 10.904 4.021 10.712 4.213C10.52 4.405 10.2827 4.50067 10 4.5ZM16 10.5C16 10.2167 16.096 9.979 16.288 9.787C16.48 9.595 16.7173 9.49933 17 9.5H18V11.5H17C16.7167 11.5 16.479 11.404 16.287 11.212C16.095 11.02 15.9993 10.7827 16 10.5ZM10 16.5C10.2833 16.5 10.521 16.596 10.713 16.788C10.905 16.98 11.0007 17.2173 11 17.5V18.5H9V17.5C9 17.2167 9.096 16.979 9.288 16.787C9.48 16.595 9.71733 16.4993 10 16.5ZM4 10.5C4 10.7833 3.904 11.021 3.712 11.213C3.52 11.405 3.28267 11.5007 3 11.5H2V9.5H3C3.28333 9.5 3.521 9.596 3.713 9.788C3.905 9.98 4.00067 10.2173 4 10.5ZM10 20.5C8.61667 20.5 7.31667 20.2373 6.1 19.712C4.88333 19.1867 3.825 18.4743 2.925 17.575C2.025 16.675 1.31267 15.6167 0.788 14.4C0.263333 13.1833 0.000666667 11.8833 0 10.5C0 9.11667 0.262667 7.81667 0.788 6.6C1.31333 5.38333 2.02567 4.325 2.925 3.425C3.825 2.525 4.88333 1.81267 6.1 1.288C7.31667 0.763333 8.61667 0.500667 10 0.5C11.3833 0.5 12.6833 0.762667 13.9 1.288C15.1167 1.81333 16.175 2.52567 17.075 3.425C17.975 4.325 18.6877 5.38333 19.213 6.6C19.7383 7.81667 20.0007 9.11667 20 10.5C20 11.8833 19.7373 13.1833 19.212 14.4C18.6867 15.6167 17.9743 16.675 17.075 17.575C16.175 18.475 15.1167 19.1877 13.9 19.713C12.6833 20.2383 11.3833 20.5007 10 20.5ZM18 10.5C18 8.26667 17.225 6.375 15.675 4.825C14.125 3.275 12.2333 2.5 10 2.5C7.76667 2.5 5.875 3.275 4.325 4.825C2.775 6.375 2 8.26667 2 10.5C2 12.7333 2.775 14.625 4.325 16.175C5.875 17.725 7.76667 18.5 10 18.5C12.2333 18.5 14.125 17.725 15.675 16.175C17.225 14.625 18 12.7333 18 10.5Z" fill="white" />
                    </svg>

                    {`${playTime.min} - ${playTime.max} minutes`}
                </PillContainer>
                <PillContainer>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.8 20.25H2C1.45 20.25 0.979002 20.054 0.587002 19.662C0.195002 19.27 -0.000664969 18.7993 1.69779e-06 18.25V14.45C0.800002 14.45 1.5 14.196 2.1 13.688C2.7 13.18 3 12.534 3 11.75C3 10.9667 2.7 10.321 2.1 9.813C1.5 9.305 0.800002 9.05067 1.69779e-06 9.05V5.25C1.69779e-06 4.7 0.196002 4.229 0.588002 3.837C0.980002 3.445 1.45067 3.24933 2 3.25H6C6 2.55 6.24167 1.95833 6.725 1.475C7.20834 0.991667 7.8 0.75 8.5 0.75C9.2 0.75 9.79167 0.991667 10.275 1.475C10.7583 1.95833 11 2.55 11 3.25H15C15.55 3.25 16.021 3.446 16.413 3.838C16.805 4.23 17.0007 4.70067 17 5.25V9.25C17.7 9.25 18.2917 9.49167 18.775 9.975C19.2583 10.4583 19.5 11.05 19.5 11.75C19.5 12.45 19.2583 13.0417 18.775 13.525C18.2917 14.0083 17.7 14.25 17 14.25V18.25C17 18.8 16.804 19.271 16.412 19.663C16.02 20.055 15.5493 20.2507 15 20.25H11.2C11.2 19.4167 10.9377 18.7083 10.413 18.125C9.88834 17.5417 9.25067 17.25 8.5 17.25C7.75 17.25 7.11234 17.5417 6.587 18.125C6.06167 18.7083 5.79934 19.4167 5.8 20.25Z" fill="white" />
                    </svg>
                    {extensions.length > 0 ? `${extensions.length} extensions` : "No extensions"}
                </PillContainer>
            </div>
            {
                hasExtensions &&
                <>
                    <ExtensionSection>
                        <h3>Extensions</h3>
                        {
                            game.extensions.map((extension) => {
                                return (
                                    <Link key={extension.key} to={`/details/${extension.key}`}>
                                        {extension.name}
                                    </Link>
                                )
                            })
                        }
                    </ExtensionSection>
                    <BasicButton onClick={() => {
                        if (isAddingExtension) {
                            addExtensionToGame(extensionId);
                        }
                        else {
                            setIsAddingExtension(true)
                        }
                    }}>
                        {isAddingExtension ? "Confirm" : "Add extension"}
                    </BasicButton>

                </>
            }
            {
                isAddingExtension &&
                <select onChange={(e) => setExtensionId(e.target.value)}>
                    <option value="">Select an extension</option>
                    {
                        allExtensionsQuery.data?.map((extension) => {
                            if (game.extensions.map((ext) => ext.key).includes(extension.key))
                                return null;

                            return (
                                <option key={extension.key} value={extension.key}>{extension.name}</option>
                            )
                        })
                    }
                </select>
            }

        </DetailContainer>
    )
}