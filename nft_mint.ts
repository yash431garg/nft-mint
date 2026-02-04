import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./turbin3-wallet.json" with { type: "json" };
import base58 from "bs58";
import { create, mplCore } from '@metaplex-foundation/mpl-core'

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT).use(mplCore());

const secretKey = Uint8Array.from(Buffer.from(wallet.privateKey, 'base64'));

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {

    const tx = await createNft(umi, {
        mint,
        name: 'OgBerg',
        uri: 'https://gateway.irys.xyz/ENVAC5BS2CGu3QSPsgKaySzZccMQGpUUmgrtYeaxpHty',
        sellerFeeBasisPoints: percentAmount(5.5),
        // Optional: add to collection (must verify separately)
        // collection: some({ key: collectionMint.publicKey, verified: false }),
    });


    console.log('NFT created:', mint.publicKey);

    // console.log('Asset created:', asset.publicKey)
    // let tx = ???
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);

    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();