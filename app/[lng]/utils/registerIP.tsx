'use client'
import { SPGNFTContractAddress, client } from './utils'
import { uploadJSONToIPFS } from './uploadToIpfs'
import { createHash } from 'crypto'
import {Address, Hex} from 'viem'
import { LicenseTerms } from '@story-protocol/core-sdk';
import { zeroAddress, zeroHash } from 'viem';

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
});

//LicensingConfig type
export type LicensingConfig = {
    isSet: boolean;
    mintingFee: bigint | string | number;
    licensingHook: Address;
    hookData: Hex;
    commercialRevShare: number | string;
    disabled: boolean;
    expectMinimumGroupRewardShare: number | string;
    expectGroupRewardPool: Address;
  };

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
    if( upload.IpfsHash == undefined){
        return "https://ipfs.io/ipfs/bafkreifk35i7knuqklmyz6da7haiuc5tkrbd7g3gekl2ho3gcwb7wpdvzi";
    }
    return "https://ipfs.io/ipfs/"+upload.IpfsHash;
} catch (error) {
    console.error("Error creating file object:", error);
}
};
//eslint-disable-next-line
export async function RegisterIP(image : string, address: Address, song: string, cid:string, pages: any) {
    //image = path.join(process.cwd(),"public/images/combined.png") || "https://ipfs.io/ipfs/bafkreifk35i7knuqklmyz6da7haiuc5tkrbd7g3gekl2ho3gcwb7wpdvzi";
    image = process.cwd()+"public/images/combined.png" || "https://ipfs.io/ipfs/bafkreifk35i7knuqklmyz6da7haiuc5tkrbd7g3gekl2ho3gcwb7wpdvzi";
    //console.log(image);
    const imageResult = await handleFileCreation(image);
    image = imageResult!;
    //console.log(image);
    //console.log(address);

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
      //console.log(contributors);

      const contract = await fetch(`https://ipfs.io/ipfs/${cid}`,{method:"GET"});
      const content = contract.text;
      //console.log(contract.json)
      //console.log("CONTENTCONTENT"+content)


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
        content: content,
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
    // const response = await client.ipAsset.mintAndRegisterIp({
    //     spgNftContract: SPGNFTContractAddress,
    //     allowDuplicates: false,
    //     recipient: address,
    //     ipMetadata: {
    //         ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
    //         ipMetadataHash: `0x${ipHash}`,
    //         nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    //         nftMetadataHash: `0x${nftHash}`,
    //     },
    //     txOptions: { waitForTransaction: true },
    // })
    // console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
    // console.log(`View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)


    
    const commercialUse: LicenseTerms = {
        transferable: true,
        royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // ex. RoyaltyPolicyLAP address
        defaultMintingFee: BigInt(100), // ex. 100n (costs 100 $WIP to mint)
        expiration: BigInt(0),
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: zeroAddress,
        commercializerCheckerData: "0x",
        commercialRevShare: 0,
        commercialRevCeiling: BigInt(0),
        derivativesAllowed: false,
        derivativesAttribution: false,
        derivativesApproval: false,
        derivativesReciprocal: false,
        derivativeRevCeiling: BigInt(0),
        currency: '0x1514000000000000000000000000000000000000', // ex. $WIP address
        uri: "https://github.com/piplabs/pil-document/blob/9a1f803fcf8101a8a78f1dcc929e6014e144ab56/off-chain-terms/CommercialUse.json"
      }
      
      const licensingConfig: LicensingConfig = {
        isSet: false,
        mintingFee: 0,
        licensingHook: zeroAddress,
        hookData: zeroHash,
        commercialRevShare: 0,
        disabled: false,
        expectMinimumGroupRewardShare: 0,
        expectGroupRewardPool: zeroAddress,
      };
      
      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [{ terms: commercialUse, licensingConfig }],
        // set to true to mint ip with same nft metadata
        allowDuplicates: true,
        // https://docs.story.foundation/docs/ip-asset#adding-nft--ip-metadata-to-ip-asset
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      })
      
      console.log(`
        Token ID: ${response.tokenId}, 
        IPA ID: ${response.ipId}, 
        License Terms ID: ${response.licenseTermsIds}
      `)

      console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
      console.log(`View on the explorer: https://aeneid.explorer.story.foundation/ipa/${response.ipId}`)

    //dispute module
    const disputeResponse = await client.dispute.raiseDispute({
        targetIpId: response.ipId as Address,
        // NOTE: you must use your own CID here, because every time it is used,
        // the protocol does not allow you to use it again
        cid: cid,
        // you must pick from one of the whitelisted tags here: https://docs.story.foundation/docs/dispute-module#/dispute-tags
        targetTag: 'IMPROPER_REGISTRATION',
        bond: 0,
        liveness: 2592000,
        txOptions: { waitForTransaction: true },
    })
    console.log(`Dispute raised at transaction hash ${disputeResponse.txHash}, Dispute ID: ${disputeResponse.disputeId}`)
}