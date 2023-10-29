import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FABButton } from '../components/FabAdd'
import { GameCard } from '../components/GameCard'
import SearchBar from '../components/SearchBar'
import { Game } from '../utils/interface'
import styled from 'styled-components'
import Controller from '../controller'
import { useState } from 'react'
import LoaderSpinner from '../components/LoaderSpinner'
import { useNavigate } from 'react-router-dom'
import { notify } from '../utils/utils'

const GamesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AdditionalFilter = styled.div`

  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
  justify-content: flex-end;


  & > input[type="checkbox"] {
    /* Hide the default checkbox */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    /* Set the desired size of the checkbox */
    width: 20px;
    height: 20px;
    /* Add a custom background color or image */
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 3px;
    background: none;
    /* Add some padding or margin as needed */
    padding: 2px;
    margin-right: 5px;

    transition: all 0.2s ease-in-out;
  }
  
  /* Styling the checked state of the checkbox */
  & > input[type="checkbox"]:checked {
    position: relative;
    /* Add a custom background color or image */
    background-color: #ffffff;
    /* Add custom styles for the checked state */
    border-color: #ffffff;
  }

  & > input[type="checkbox"]:checked::before {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    content: "✔";
    text-align: center;
    color: #000000;
  }

`;

function App() {
  const controller = Controller.getInstance();
  const [currentFilter, setCurrentFilter] = useState<string>("")
  const [showOnlyGames, setShowOnlyGames] = useState<boolean>(false)
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const queryGames = useQuery<Game[]>(["games", currentFilter, showOnlyGames], async () => {
    const games = await controller.getGames(currentFilter.toLowerCase(), showOnlyGames)
    return games
  });

  const onSearch = (search: string) => {
    setCurrentFilter(search)
    queryClient.invalidateQueries(["games", currentFilter.toLowerCase(), false])
    setShowOnlyGames(false);
  }

  const refreshAndShowOnlyGames = () => {
    queryClient.invalidateQueries(["games", currentFilter.toLowerCase(), showOnlyGames])
  }

  const navigateToDetails = () => {
    navigate("/add")
  }

  return (
    <>
      <SearchBar onSearch={onSearch} />
      <AdditionalFilter>
        {/* show only game and not extensions */}
        <input type="checkbox" id="filter" name="filter" checked={showOnlyGames} onChange={(e) => {
          setShowOnlyGames(e.target.checked)
          refreshAndShowOnlyGames()
          notify(!showOnlyGames ? "Showing only games" : "Showing games and extensions")
        }} />
        <label htmlFor="filter">Show only games</label>
      </AdditionalFilter>
      <br />
      <GamesList>
        {
          queryGames.isLoading &&
          <div style={{ display: "grid", position: "absolute", left: "50%", transform: "translate(-50%)", "placeContent": "center" }}>
            <LoaderSpinner />
          </div>
        }
        {queryGames.data &&
          queryGames.data?.map(game => {
            return (<GameCard key={game.key} game={game} />)
          })
        }
      </GamesList>
      <br />
      <br />
      <br />
      <br />
      <br />
      <FABButton onClick={navigateToDetails} backgroundFabColor="var(--green-accent)" />
    </>
  )
}

export default App
