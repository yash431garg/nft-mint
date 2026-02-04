import wallet from "./turbin3-wallet.json" with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

const secretKey = Uint8Array.from(Buffer.from(wallet.privateKey, 'base64'));

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const metadata = {
            name: "OgBerg",
            symbol: "OB",
            description: "He is a Og teacher ",
            image: "https://gateway.irys.xyz/94nAJLcpC1fSiLv1QZpbvESkj3tzu48ooWtTSTNgkuoh",
            attributes: [
                { trait_type: 'Rust Teacher', value: '1000' }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "https://gateway.irys.xyz/94nAJLcpC1fSiLv1QZpbvESkj3tzu48ooWtTSTNgkuoh"
                    },
                ]
            },
            creators: []
        };

        //3. Upload image

        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
