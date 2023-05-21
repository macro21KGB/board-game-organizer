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

const GamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }
`;

function App() {
  const controller = Controller.getInstance();
  const [currentFilter, setCurrentFilter] = useState<string>("")
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const queryGames = useQuery<Game[]>(["games", currentFilter], async () => {
    const games = await controller.getGames(currentFilter)
    return games
  });

  const onSearch = (search: string) => {
    setCurrentFilter(search)
    queryClient.invalidateQueries(["games", currentFilter])
  }

  const navigateToDetails = () => {
    navigate("/add")
  }

  return (
    <>
      <SearchBar onSearch={onSearch} />
      <br />
      <GamesList>
        {queryGames.isLoading &&
          <div style={{ display: "grid", "placeContent": "center" }}>
            <LoaderSpinner />
          </div>
        }
        {queryGames.data &&
          queryGames.data?.map(game => {
            if (!game) return null
            if (currentFilter != "") {
              if (game.name.toLowerCase().includes(currentFilter.toLowerCase())) {
                return (<GameCard key={game.key} game={game} />)
              }
            }
            return (<GameCard key={game.key} game={game} />)
          })
        }
      </GamesList>
      <br />
      <br />
      <br />
      <br />
      <br />
      <FABButton onClick={navigateToDetails} />
    </>
  )
}

export default App
