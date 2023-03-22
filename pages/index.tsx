import {
	ConnectWallet,
	useAddress,
	useDisconnect,
	useMetamask,
	useNetwork,
	useNetworkMismatch,
	useSDK,
} from "@thirdweb-dev/react"
import { ChainId, ContractType, ContractWithMetadata } from "@thirdweb-dev/sdk"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import NFTCollection from "../components/NFTCollection"

const Home: NextPage = () => {
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [collections, setCollections] = useState<ContractWithMetadata[]>([])
	const address = useAddress()
	const connectWithMetamask = useMetamask()
	const disconnectWallet = useDisconnect()
	const sdk = useSDK()
	const [, switchNetwork] = useNetwork()
	const isWrongNetwork = useNetworkMismatch()

	useEffect(() => {
		if (isWrongNetwork && switchNetwork) {
			switchNetwork(ChainId.Goerli)
		}
	}, [isWrongNetwork, switchNetwork, address])

	useEffect(() => {
		if (!address || !sdk) return

		const getCollections = async () => {
			const contracts = await sdk?.getContractList(address)

			const nftCollections = contracts.filter(async (contract) => {
				const name = await contract.contractType()

				return name === "nft-collection"
			})

			setCollections(nftCollections)
		}

		getCollections()
	}, [address, sdk])

	// This function is the same thing as enter on https://thirdweb.com/thirdweb.eth/TokenERC721 and deploy a NFT Collection contract
	async function deployNftCollection() {
		if (!sdk || !address) return

		if (!name || !description)
			return alert(
				"Please fill in the name and description of the NFT Collection"
			)

		const nftCollectionDeployed = await sdk?.deployer.deployNFTCollection({
			name,
			description,
			primary_sale_recipient: address,
		})

		alert("NFT Collection deployed at " + nftCollectionDeployed)
		// NFT Collection deployed at 0xc556413E7c09248fB037e22088611fa75553892E

		// https://thirdweb.com/dashboard/contracts
	}

	return (
		<div>
			<div style={{ width: "250px" }}>
				<ConnectWallet
					accentColor={isWrongNetwork ? "#c4c4c4" : "#f213a4"}
					colorMode="light"
				/>
				{isWrongNetwork ? (
					<p>Please switch your network to the Goerli network</p>
				) : (
					""
				)}
			</div>
			{address ? (
				<>
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<button onClick={deployNftCollection}>Deploy NFT Collection</button>
					<hr />

					<h2>My NFT Collections</h2>

					{collections?.map((collection) => {
						return (
							<NFTCollection collection={collection} key={collection.address} />
						)
					})}
				</>
			) : (
				<h1>Connect to see your NFT collection on Goerli network</h1>
			)}
		</div>
	)
}

export default Home
