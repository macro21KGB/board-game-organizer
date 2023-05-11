import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FABAdd } from '../components/FabAdd'
import { GameCard } from '../components/GameCard'
import SearchBar from '../components/SearchBar'
import { Game } from '../utils/interface'
import styled from 'styled-components'
import Controller from '../controller'
import { useState } from 'react'
import LoaderSpinner from '../components/LoaderSpinner'

const GamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;


function App() {
  const controller = Controller.getInstance();
  const [currentFilter, setCurrentFilter] = useState<string>("")
  const queryClient = useQueryClient();

  const queryGames = useQuery<Game[]>(["games", currentFilter], async () => {
    const games = await controller.getGames(currentFilter)
    return games
  });

  const onSearch = (search: string) => {
    setCurrentFilter(search)
    queryClient.invalidateQueries(["games", currentFilter])
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
      <FABAdd />
    </>
  )
}

export default App
