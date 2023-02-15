import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../../utils/notifications";
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

import { Buffer } from 'buffer';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import idl from '../../ubi_idl.json'
import { UBIInfo } from '../../types/types';
import { GatewayProvider, useGateway } from '@civic/solana-gateway-react';

const programID = new PublicKey(idl.metadata.address);


export const CivicTrust: FC = () => {
    const connection = new Connection("***REMOVED***");
    const moniker = connection.rpcEndpoint.includes("mainnet") ? "mainnet-beta" : "devnet"
    const wallet = useWallet()
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const { gatewayToken, gatewayStatus, requestGatewayToken } = useGateway();

    const getProvider = () => {
        return new AnchorProvider(
            connection,
            wallet,
            AnchorProvider.defaultOptions()
        );
    };

    const provider = getProvider()

    async function verify(info) {
        try {
            let idl = await Program.fetchIdl(programID, provider)

            const program = new Program(idl, programID, provider)

            let transaction = new Transaction();
            transaction.add(
                await program.methods.civicTrust(gatewayToken.gatekeeperNetworkAddress).accounts({
                    owner: wallet.publicKey,
                    gatewayToken: gatewayToken.publicKey,
                    ubiInfo: info[0]
                }).instruction()
            );

            let signature = await wallet.sendTransaction(transaction, connection);

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: signature,
            });
        } finally {
            notify({ type: "success", message: "You are now verified" })
        }
    }

    const onClick = useCallback(async () => {

        if (!wallet.publicKey) {
            notify({ type: 'error', message: 'Please connect your wallet' });
            return;
        }

        let info = PublicKey.findProgramAddressSync(
            [Buffer.from("ubi_info7"), wallet.publicKey.toBytes()],
            programID
        )

        let trustee_info_raw = await connection.getAccountInfo(info[0])

        if (!trustee_info_raw) {
            notify({ type: 'error', message: "You must initialize your account before verifying" });
            return;
        } else {
            let infoO = new UBIInfo(trustee_info_raw.data)

            if (infoO.getIsTrusted().valueOf()) {
                notify({ type: 'info', message: "You're already verified" });
                return;
            }
        }

        if (gatewayToken && gatewayToken.state == "ACTIVE") {
            verify(info)
        } else {
            requestGatewayToken()
        }
    }, [wallet.publicKey, connection, getUserSOLBalance]);

    return (
        <GatewayProvider
            wallet={wallet}
            gatekeeperNetwork={new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")}
            cluster={"mainnet"}
            connection={connection}>
            <button
                className="px-8 m-2 btn bg-[#ff6b4e] max-width-200 width-20..."
                onClick={onClick}>
                Get verified with <img src='civic-logo-white.svg' className='w-16 ml-4'></img>
            </button>
        </GatewayProvider>
    );
};

