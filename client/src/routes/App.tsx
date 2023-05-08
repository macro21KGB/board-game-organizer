import { FABAdd } from '../components/FabAdd'
import { GameCard } from '../components/GameCard'
import SearchBar from '../components/SearchBar'
import { Game } from '../utils/interface'

const dummyGame: Game = {
  id: 1,
  name: "Dummy Game",
  imageUrl: "https://via.placeholder.com/120",
  hasExtensions: true,
  isExtension: false,
  players: {
    min: 2,
    max: 4
  },
  extensions: [
    2, 3, 4
  ],
  playTime: {
    min: 30,
    max: 60
  },
  score: 7.5,
}

function App() {

  return (
    <>
      <SearchBar />
      <br />
      <GameCard game={dummyGame} />
      <FABAdd />
    </>
  )
}

export default App
