import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Pnfts } from "../target/types/pnfts";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

describe("pnfts", () => {
  // Configure the client to use the local cluster.

  const provider = AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.Pnfts as Program<Pnfts>;

  const globalPool = anchor.web3.Keypair.generate();

  // Reemplaza con la dirección del token mint que ya tienes
  const tokenMint = new anchor.web3.PublicKey("3kvfe38eNdHe1PVtBUnS1wwirweXEzw2FLE88fKssmgr");
  const tokenMetadataProgram = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  let globalPoolPda: anchor.web3.PublicKey;
  before(async () => {
    [globalPoolPda] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("global-authority")],
      program.programId
    );

    try {
      await program.methods.initialize()
        .accounts({
          globalPool: globalPoolPda,
          admin: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log("Global pool initialized.");

          // Realizamos el fetch de la cuenta globalPool para confirmar su estado
    const globalPoolState = await program.account.globalPool.fetch(globalPoolPda);
    console.log("Fetched Global Pool State:", {
      admin: globalPoolState.admin.toBase58(),
      totalPnftStakedCount: globalPoolState.totalPnftStakedCount.toNumber(),

      });
    } catch (error) {
      console.error("Error initializing global pool:", error);
    }
  });
  it("Locks a pNFT", async () => {
    try {
      const tokenAccount = await getAssociatedTokenAddress(tokenMint, provider.wallet.publicKey);
      const [metadataPDA] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), tokenMetadataProgram.toBuffer(), tokenMint.toBuffer()],
        tokenMetadataProgram
      );
      const [editionPDA] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), tokenMetadataProgram.toBuffer(), tokenMint.toBuffer(), Buffer.from("edition")],
        tokenMetadataProgram
      );

      // Derivar tokenMintRecord automáticamente
      const [tokenMintRecord] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("token_record"), tokenMint.toBuffer()],
        TOKEN_PROGRAM_ID
      );

      // Usar direcciones ficticias para authRules y authRulesProgram si no son necesarias
      const authRules = anchor.web3.Keypair.generate().publicKey;
      const authRulesProgram = anchor.web3.Keypair.generate().publicKey;

      const tx = await program.methods.lockPnft().accounts({
        payer: provider.wallet.publicKey,
        user: provider.wallet.publicKey,
        globalPool: globalPoolPda,
        tokenMint: tokenMint,
        tokenAccount: tokenAccount,
        tokenMintEdition: editionPDA,
        tokenMintRecord: tokenMintRecord,
        mintMetadata: metadataPDA,
        authRules: authRules,
        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: tokenMetadataProgram,
        authRulesProgram: authRulesProgram,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([globalPool]).rpc();
      console.log("Lock pNFT transaction signature", tx);
    } catch (error) {
      console.error("Error locking pNFT:", error);
    }
  });

  it("Unlocks a pNFT", async () => {
    try {
      const tokenAccount = await getAssociatedTokenAddress(tokenMint, provider.wallet.publicKey);
      const [metadataPDA] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), tokenMetadataProgram.toBuffer(), tokenMint.toBuffer()],
        tokenMetadataProgram
      );
      const [editionPDA] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("metadata"), tokenMetadataProgram.toBuffer(), tokenMint.toBuffer(), Buffer.from("edition")],
        tokenMetadataProgram
      );

      // Derivar tokenMintRecord automáticamente
      const [tokenMintRecord] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("token_record"), tokenMint.toBuffer()],
        TOKEN_PROGRAM_ID
      );

      // Usar direcciones ficticias para authRules y authRulesProgram si no son necesarias
      const authRules = anchor.web3.Keypair.generate().publicKey;
      const authRulesProgram = anchor.web3.Keypair.generate().publicKey;
      const userPubkey = provider.wallet.publicKey;

      const tx = await program.methods.unlockPnft().accounts({
        user: userPubkey,
        globalPool: globalPoolPda,
        tokenMint: tokenMint,
        tokenAccount: tokenAccount,
        tokenMintEdition: editionPDA,
        tokenMintRecord: tokenMintRecord,
        mintMetadata: metadataPDA,
        authRules: authRules,
        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: tokenMetadataProgram,
        authRulesProgram: authRulesProgram,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([globalPool]).rpc();
      console.log("Unlock pNFT transaction signature", tx);
    } catch (error) {
      console.error("Error unlocking pNFT:", error);
    }
  });
});
