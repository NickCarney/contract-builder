'use client'
import { SPGNFTContractAddress, client } from './utils'
import { uploadJSONToIPFS } from './uploadToIpfs'
import { createHash } from 'crypto'
import {Address} from 'viem'
import path from 'path';

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
});


async function createFileObject(fileData: Blob | ArrayBuffer, fileName: string, fileType: string): Promise<File> {
    return new File([fileData], fileName, { type: fileType });
  }

async function handleFileCreation(filePath: string) {
try {
    const response = await fetch(filePath);
    const fileData = await response.blob();
    
    const fileName = 'combined.png';
    const fileType = 'image/png';

    const file = await createFileObject(fileData, fileName, fileType);
    

    const upload = await pinata.upload.file(file);
    return upload.IpfsHash;
} catch (error) {
    console.error("Error creating file object:", error);
}
};
//eslint-disable-next-line
export async function RegisterIP(image : string, address: Address, song: string, cid:string, pages: any) {
    image = path.join(process.cwd(),"public/images/combined.png") || "https://ipfs.io/ipfs/bafkreifk35i7knuqklmyz6da7haiuc5tkrbd7g3gekl2ho3gcwb7wpdvzi";
    console.log(image);
    handleFileCreation(image);
    console.log(address);

    interface Contributor {
        id: number;
        name: string;
        email: string;
        split: number;
        aka: string;
        ipi: string;
        homeAddress: string;
        idNum: string;
        publisher: string;
    }

    const contributors: Contributor[][] = [];

    Object.keys(pages).forEach((id) => {
      const pageData = pages[Number(id)];
        const name = pageData.legalName;
        const email = pageData.email;
        const split = pageData.split;
        const aka = pageData.aka;
        const ipi = pageData.ipi;
        const homeAddress = pageData.address;
        const idNum = pageData.id;
        const publisher = pageData.producer;

        contributors.push([{id:1, name:name, email:email, split:split, aka:aka, ipi:ipi, homeAddress:homeAddress, idNum:idNum, publisher:publisher}]);
      });
      console.log(contributors);


      //image = image;
      const imageHash = createHash('sha256').update(JSON.stringify(image)).digest('hex')
      const mediaUrl = `https://ipfs.io/ipfs/${cid}`;
      const mediaHash = createHash('sha256').update(JSON.stringify(mediaUrl)).digest('hex')



    // 1. Set up your IP Metadata
    //
    // Docs: https://docs.story.foundation/docs/ipa-metadata-standard
    const ipMetadata = {
        title: song,
        description: `This is a contract built on Mesa for ${song}`,
        creators: contributors,
        image: image,
        imageHash: imageHash,
        mediaUrl: mediaUrl,
        mediaHash: mediaHash,
        mediaType: 'image/png',
    }

    // 2. Set up your NFT Metadata
    //
    // Docs: https://docs.opensea.io/docs/metadata-standards#metadata-structure
    const nftMetadata = {
        name: song,
        description: `This is a contract built on Mesa for ${song} This NFT represents ownership of the IP Asset.`,
        image: image,
        media: [
            {
                name: song,
                url: `https://ipfs.io/ipfs/${cid}`,
                mimeType: 'image/png',
            },
        ],
        attributes: [
            {
                key: 'song',
                value: song,
            },
            {
              key: 'contributors',
              value: contributors,

            },
        ],
    }

    // 3. Upload your IP and NFT Metadata to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

    // 4. Register the NFT as an IP Asset
    //
    // Docs: https://docs.story.foundation/docs/sdk-ipasset#mintandregisterip
    const response = await client.ipAsset.mintAndRegisterIp({
        spgNftContract: SPGNFTContractAddress,
        allowDuplicates: false,
        recipient: address,
        ipMetadata: {
            ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
            nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
    })
    console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
    console.log(`View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)
}