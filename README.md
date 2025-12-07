
FLARESHIELD-X— Self-Defending Smart Wallet on Flare Coston2

FlareSafe Wallet is an advanced security-focused smart contract deployed on the Flare Coston2 Testnet.
It introduces on-chain automated protection mechanisms that safeguard user funds from risky transactions, suspicious behavior, unauthorized access, and accidental transfers.
The project demonstrates how blockchain logic can enforce self-protection, role-based controls, and transaction monitoring without relying solely on private keys.

⭐ Key Highlights

Automated freeze protection triggered by high-risk behavior

Guardian-based human oversight for emergency freezing

Time-locked unfreeze for enhanced safety

Configurable protection parameters

Full frontend integration with MetaMask using Ethers.js

A complete demonstration of secure smart-contract wallet design

🛡️ Security Features
1. Auto-Freeze System

The wallet automatically freezes when it detects:

High-value transfers

Transfers to risky addresses

Rapid repeated transactions (draining attempts)

Transfers to untrusted addresses while Safe Mode is enabled

2. Manual & Guardian Controls

Owner Manual Freeze: Instant panic protection

Guardian Freeze: Additional human safeguard

Time-Locked Unfreeze: Prevents immediate reactivation after freezing

3. Configurable Protection Settings

The owner can update:

High-value threshold

Risky addresses

Trusted addresses

Safe Mode

Timelock duration

Rapid transaction limits

Guardian wallet address

🔧 Smart Contract Details

Network: Flare Coston2 Testnet

Contract Address: 0xb364d14338A3964Ef75cEDA7283114c32cB12356

Language: Solidity 0.8.20

Standard: Native token handling (C2FLR)

The contract is designed to be simple, modular, and highly secure, focusing on detect-and-protect behavior against common attack patterns.

🖥️ Frontend Application

A lightweight Web3 interface built using:

HTML / CSS / JavaScript

Ethers.js

MetaMask Integration

Toast Notifications for all actions

Live Status Panel showing:

Wallet owner

Guardian

Frozen state

Balance

Safe Mode state

Supported Frontend Actions

Connect wallet

Deposit C2FLR

Transfer funds

Set guardian

Configure threshold

Add risky/trusted addresses

Toggle safe mode

Freeze / Guardian freeze

Unfreeze after timelock

📁 Project Structure
/index.html        # Frontend UI
/script.js         # Ethers.js smart contract integration
/abi.json          # Smart contract ABI
/style.css         # UI styling

🚀 How to Run the Project
Prerequisites

MetaMask installed

Flare Coston2 Testnet added

Some C2FLR test tokens for interaction

Steps

Download or clone the repository

Open index.html in a browser

Connect MetaMask

Interact with wallet functions directly from the UI

🎓 Purpose of This Project

FlareSafe Wallet is designed for:

Blockchain training and OJT programs

Demonstrating smart contract security concepts

Learning Web3 frontend-backend integration

Understanding real-world wallet attack scenarios

Building secure dApps

It is an ideal educational and demonstration tool for showcasing how smart contracts can intelligently defend themselves against threats.

📌 Key Learning Outcomes

By studying or using this project, learners understand:

Smart contract design patterns

Role-based control (owner & guardian)

On-chain security automation

Transaction monitoring

Ethers.js frontend integration

Safe wallet architecture

Demo video
https://drive.google.com/file/d/1Vg595PH_27_kSF86EizkK2dDclqpUWJt/view?usp=sharing

Presentation 
https://drive.google.com/file/d/1Vg595PH_27_kSF86EizkK2dDclqpUWJt/view?usp=sharing

📄 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it with proper attribution.

🏁 Final Notes

FlareSafe Wallet proves that a blockchain wallet can operate as a smart, self-defending security system, not just a passive storage address.
It combines automation, human oversight, and rule-based logic to create a safer and more resilient user experience on Web3.
=======
# FLARESHIELD-X
FlareSafe Wallet is a self-defending smart wallet on Coston2 that protects funds with auto-freeze, guardian freeze, safe mode, risky address blocking, and time-locked unfreeze. It detects high-value or suspicious activity and secures transfers using configurable on-chain security rules
>>>>>>> 8ccd5d7c28cab355aff894b8aa44ae05c654caa1
