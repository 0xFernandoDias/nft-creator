import { ThirdwebNftMedia, useContract, useNFTs } from "@thirdweb-dev/react"
import { ContractWithMetadata } from "@thirdweb-dev/sdk"
import { useEffect, useState } from "react"

export default function NFTCollection({
	collection,
}: {
	collection: ContractWithMetadata
}) {
	const [isLoading, setIsLoading] = useState(true)
	const [metadata, setMetadata] = useState<any>(null)

	const { contract } = useContract(collection.address)

	const { data: nfts, isLoading: isFetchLoading } = useNFTs(contract)

	useEffect(() => {
		const getMetadata = async () => {
			const metadata = await collection.metadata()
			setMetadata(metadata)
			setIsLoading(false)
		}

		getMetadata()
	}, [collection])

	if (isLoading) return <p>Loading...</p>

	return (
		<>
			<h3>{metadata?.name}</h3>
			{isFetchLoading ? (
				<p>Loading...</p>
			) : (
				nfts?.map((nft) => {
					return (
						<div key={nft.metadata.id.toString()}>
							<ThirdwebNftMedia
								metadata={metadata}
								style={{ width: "100px", height: "100px" }}
							/>
						</div>
					)
				})
			)}
		</>
	)
}
