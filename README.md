# FLARESHIELD-X — Self-Defending Smart Wallet on Flare Coston2

FlareShield-X (FlareSafe Wallet) is an advanced **self-defending smart contract wallet** built on the **Flare Coston2 Testnet**. It protects user funds automatically using on-chain security rules, real-time monitoring, and guardian-controlled fail-safes.

The wallet prevents fund loss by freezing itself when suspicious activity is detected and enforcing strict transaction safety rules.

---

## 🚀 Project Overview

- Intelligent auto-freeze protection  
- Guardian-assisted freeze & recovery  
- Time-locked unfreeze mechanism  
- High-value transfer security  
- Safe-mode transaction validation  
- Risky/trusted address management  
- Complete frontend using **Ethers.js + MetaMask**

---

## ⭐ Key Features

### 🔒 Automated Security
Auto-freeze activates when the wallet detects:
- High-value transfers  
- Transfers to risky addresses  
- Rapid repeated transactions (drain attempts)  
- Transfers to untrusted addresses in Safe Mode  

### 👥 Dual-Control System
- Owner Freeze – immediate emergency freeze  
- Guardian Freeze – secondary human safety layer  
- Time-Locked Unfreeze – prevents instant recovery after attack
- Guardian Freeze — A trusted account can freeze the wallet if the owner is compromised.
- High-Value Threshold — Automatically freeze above a chosen amount.
- Risky Address Blocking — Prevent funds from reaching scam wallets.
- Trusted Address Mode — Allow transfers only to approved wallets when Safe Mode is enabled.
- 

### ⚙️ Customizable Parameters
The owner can modify:
- High-value limit  
- Risky/trusted addresses  
- Safe mode  
- Timelock duration  
- Rapid transaction limits  
- Guardian wallet  

---

## 🔧 Smart Contract Details

| Property | Value |
|---------|-------|
| **Network** | Flare Coston2 Testnet |
| **Contract Address** | `0x2798016fFFC711A153Fae8623d4429535Bd95397` |
| **Language** | Solidity 0.8.30 |
| **Token** | Native C2FLR |

---

## 🖥️ Frontend Stack

Built with:
- HTML  
- CSS  
- JavaScript  
- Ethers.js  
- MetaMask  

### Frontend Capabilities
- Connect wallet  
- Deposit C2FLR  
- Transfer funds  
- Freeze / Guardian freeze  
- Unfreeze after timelock  
- Add risky or trusted addresses  
- Set guardian  
- Configure high-value threshold  
- Toggle Safe Mode  
- Live wallet status panel  

---

## 📁 Project Structure

