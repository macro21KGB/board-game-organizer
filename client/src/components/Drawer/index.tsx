import styled from "styled-components";
import Controller from "../../controller";

const DrawerBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
`;

const DrawerContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;

    width: 80%;
    height: 100%;
    
    color: white;
    background-color: #101f3d;
    z-index: 101;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;


    @media (min-width: 768px) {
        width: 50%;
    }
`;

const CloseModalButton = styled.button`
  all: unset;
  cursor: pointer;

  border: none;
  color: white;
  outline: none;

  font-size: 3rem;
  font-weight: 100;
`;

const DrawerHeader = styled.div`

    display: flex;
    flex-direction: row;
    align-items: center;
    
    padding: 0.5rem;
    background-color: #223353;
    justify-content: space-between;
`;

const DrawerButton = styled.button`
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

const DrawerContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;
	gap: 1rem;
	padding: 1rem;
`;

interface DrawerProps {
	onClose: () => void;
}

export default function Drawer(props: DrawerProps) {
	const { onClose } = props;
	const controller = Controller.getInstance();


	// export data as a JSON file
	const exportData = async () => {
		console.log("Exporting data");
		const data = await controller.getGames();
		const dataStr = JSON.stringify(data, null, 2);
		console.log(dataStr);
		const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
		const exportFileDefaultName = "data.json";
		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();

	};

	return (
		<DrawerBackground onClick={onClose}>
			<DrawerContainer>
				<DrawerHeader>
					<CloseModalButton onClick={onClose}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="white"
							style={{
								width: "2rem",
								height: "2rem",
								fontWeight: 700,
							}}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
							/>
						</svg>
					</CloseModalButton>
				</DrawerHeader>
				<DrawerContent>
					<DrawerButton onClick={() => exportData()}>
						Export your data (JSON)
					</DrawerButton>
				</DrawerContent>

			</DrawerContainer>
		</DrawerBackground>
	);
}
