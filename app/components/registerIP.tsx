"use client"
import { SPGNFTContractAddress, client } from '../[lng]/utils/utils'
import { uploadJSONToIPFS } from '../[lng]/utils/uploadToIpfs'
import { createHash } from 'crypto'

import useStory from '../[lng]/store/useStory'
import useQuestion1 from '../[lng]/store/useQuestion1'
import useQuestion2 from '../[lng]/store/useQuestion2'
import useDynamicPageStore from '../[lng]/store/use[page]'

import mesaImage from "../[lng]/public/images/mesa_logo.png"

async function registerIP (image: string) {
    //console.log(image);

    const address = useStory((state) => state.address || '');
    const song = useQuestion2((state) => state.song || state.recording || '');
    const cid = useQuestion1((state) => state.cid || '');
    const pages = useDynamicPageStore((state) => state.pages);

    console.log(address);

    let contributors: any[] = [{}];

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


      image = image;
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
        image: mesaImage,//fromPath(`https://ipfs.io/ipfs/${cid}`, options).bulk(-1),
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


export default registerIP;