import wallet from "./turbin3-wallet.json" with { type: "json" };
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

const secretKey = Uint8Array.from(Buffer.from(wallet.privateKey, 'base64'));

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader({
    address: 'https://devnet.irys.xyz'
}));
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const img = await readFile('./images/berg.png')
        //2. Convert image to generic file.
        const file = await createGenericFile(img, 'berg.png', {
            contentType: 'image/png'
        })
        //3. Upload image

        const myUri = await umi.uploader.upload([file]);

        console.log("Your image URI: ", myUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
