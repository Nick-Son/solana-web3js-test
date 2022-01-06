const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  Account,
} = require("@solana/web3.js")

// Generate new wallet object
const newPair = new Keypair()
const publicKey = new PublicKey(newPair._keypair.publicKey).toString()
const secretKey = newPair._keypair.secretKey

// Get wallet balance
const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
    const myWallet = await Keypair.fromSecretKey(secretKey)
    const walletBalance = await connection.getBalance(new PublicKey(myWallet.publicKey))

    console.log(`=> For wallet address ${publicKey}`);
    console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL} SOL`);
  } catch (error) {
    console.log(error)
  }
}

// Airdrop SOL into generated wallet
const airDropSol = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
    const walletKeyPair = await Keypair.fromSecretKey(secretKey)
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(walletKeyPair.publicKey),
      2 * LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(fromAirDropSignature)
  } catch (error) {
    console.log(error)
  }
}

// Test
const driverFunction = async () => {
  await getWalletBalance()
  await airDropSol()
  await getWalletBalance()
}

driverFunction()