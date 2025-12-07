//------------------------------------------------------
// LOAD PROVIDER + SIGNER + CONTRACT + ABI
//------------------------------------------------------
let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0x2798016fFFC711A153Fae8623d4429535Bd95397";
let CONTRACT_ABI = null;

// Load ABI
fetch("abi.json")
  .then(res => res.json())
  .then(data => {
    CONTRACT_ABI = data;
    console.log("ABI Loaded Successfully");
    setMessage("✅ Smart contract ABI loaded. Ready to connect!", 'success');
  })
  .catch(err => {
    console.error("ABI Load Error:", err);
    setMessage("❌ Failed to load contract ABI. Please refresh the page.", 'error');
  });


//------------------------------------------------------
// UI HELPERS
//------------------------------------------------------
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
  
  console.log(msg);
}

function setMessage(msg, type = 'info') {
  showToast(msg, type);
}

//---------------------- FIXED FUNCTION ---------------------------
// Prevent buttons from getting stuck on "Processing..."
function setButtonLoading(buttonId, isLoading) {
  const btn = document.getElementById(buttonId);

  // NEW FIX → prevent UI break when wrong ID is passed
  if (!btn) {
    console.warn(`⚠️ Button with ID "${buttonId}" not found in HTML.`);
    return;
  }

  if (isLoading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = '⏳ Processing...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || btn.textContent;
  }
}
//----------------------------------------------------------------

function clearInputs(...inputIds) {
  inputIds.forEach(id => {
    document.getElementById(id).value = '';
  });
}


//------------------------------------------------------
// TAB FUNCTIONALITY
//------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
});


//------------------------------------------------------
// CONNECT WALLET
//------------------------------------------------------
document.getElementById("connectBtn").onclick = async () => {
  try {
    if (!window.ethereum) {
      return setMessage("❌ MetaMask not detected. Please install MetaMask!", 'error');
    }

    setButtonLoading('connectBtn', true);
    setMessage("🔄 Connecting to MetaMask...", 'info');

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("accountInfo").textContent =
      address.slice(0, 6) + "..." + address.slice(-4);

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    document.getElementById("contractInfo").textContent =
      CONTRACT_ADDRESS.slice(0, 6) + "..." + CONTRACT_ADDRESS.slice(-4);
    
    document.getElementById("walletInfoBar").style.display = "flex";

    setMessage("✅ Wallet connected successfully!", 'success');

    setTimeout(() => {
      document.getElementById("refreshStatusBtn").click();
    }, 500);

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to connect wallet: " + err.message, 'error');
  } finally {
    setButtonLoading('connectBtn', false);
  }
};


//------------------------------------------------------
// REFRESH STATUS
//------------------------------------------------------
document.getElementById("refreshStatusBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');

    setButtonLoading('refreshStatusBtn', true);
    setMessage("🔄 Fetching wallet status...", 'info');

    const status = await contract.getStatus();

    document.getElementById("statusText").textContent = 
      status[4].slice(0, 6) + "..." + status[4].slice(-4);
    document.getElementById("balanceText").textContent =
      parseFloat(ethers.formatEther(status[1])).toFixed(4) + " C2FLR";
    document.getElementById("frozenText").textContent =
      status[0] ? "🔒 Yes" : "🔓 No";
    document.getElementById("guardianText").textContent =
      status[5] === "0x0000000000000000000000000000000000000000"
        ? "Not Set"
        : status[5].slice(0, 6) + "..." + status[5].slice(-4);
    document.getElementById("safeModeText").textContent =
      status[3] ? "🛡️ Enabled" : "⚠️ Disabled";

    setMessage("✅ Status refreshed successfully!", 'success');
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to fetch status: " + err.message, 'error');
  } finally {
    setButtonLoading('refreshStatusBtn', false);
  }
};


//------------------------------------------------------
// DEPOSIT
//------------------------------------------------------
document.getElementById("depositBtn").onclick = async () => {
  try {
    if (!contract || !signer) return setMessage("⚠️ Wallet not connected.", 'error');

    let amountC2FLR = document.getElementById("depositAmount").value.trim();

    if (!amountC2FLR || isNaN(amountC2FLR) || parseFloat(amountC2FLR) <= 0) {
      return setMessage("❌ Invalid amount.", 'error');
    }

    const amountWei = ethers.parseEther(amountC2FLR.toString());

    setButtonLoading('depositBtn', true);
    setMessage(`🔄 Processing deposit of ${amountC2FLR} C2FLR...`, 'info');

    const tx = await contract.deposit({ value: amountWei });
    await tx.wait();

    setMessage(`✅ Deposit of ${amountC2FLR} C2FLR successful!`, 'success');
    clearInputs('depositAmount');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Deposit failed: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('depositBtn', false);
  }
};


//------------------------------------------------------
// TRANSFER
//------------------------------------------------------
document.getElementById("transferBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');

    let to = document.getElementById("transferTo").value.trim();
    let amountInput = document.getElementById("transferAmount").value.trim();

    if (!ethers.isAddress(to)) {
      return setMessage("❌ Invalid recipient address.", 'error');
    }

    if (!amountInput || isNaN(amountInput) || parseFloat(amountInput) <= 0) {
      return setMessage("❌ Invalid amount.", 'error');
    }

    const amountWei = ethers.parseEther(amountInput.toString());

    setButtonLoading('transferBtn', true);
    setMessage(`🔄 Processing transfer of ${amountInput} C2FLR...`, 'info');

    const tx = await contract.transfer(to, amountWei);
    await tx.wait();

    setMessage(`✅ Transfer of ${amountInput} C2FLR completed!`, 'success');
    clearInputs('transferTo', 'transferAmount');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Transfer failed: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('transferBtn', false);
  }
};


//------------------------------------------------------
// SECURITY CONTROLS
//------------------------------------------------------
document.getElementById("setGuardianBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    let addr = document.getElementById("guardianAddress").value.trim();
    if (!ethers.isAddress(addr)) return setMessage("❌ Invalid address format.", 'error');

    setButtonLoading('setGuardianBtn', true);
    setMessage("🔄 Setting guardian address...", 'info');

    const tx = await contract.setGuardian(addr);
    await tx.wait();
    
    setMessage("✅ Guardian set successfully!", 'success');
    clearInputs('guardianAddress');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to set guardian: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('setGuardianBtn', false);
  }
};

document.getElementById("setThresholdBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    let amt = document.getElementById("thresholdAmount").value.trim();
    if (!amt || isNaN(amt) || parseFloat(amt) < 0) return setMessage("❌ Invalid amount.", 'error');
    
    const amountWei = ethers.parseEther(amt.toString());

    setButtonLoading('setThresholdBtn', true);
    setMessage(`🔄 Setting high-value threshold to ${amt} C2FLR...`, 'info');

    const tx = await contract.setHighValueThreshold(amountWei);
    await tx.wait();

    setMessage(`✅ High-value threshold set to ${amt} C2FLR!`, 'success');
    clearInputs('thresholdAmount');

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to set threshold: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('setThresholdBtn', false);
  }
};

document.getElementById("setRiskyBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    let addr = document.getElementById("riskyAddress").value.trim();
    if (!ethers.isAddress(addr)) return setMessage("❌ Invalid address format.", 'error');

    setButtonLoading('setRiskyBtn', true);
    setMessage("🔄 Marking address as risky...", 'info');

    const tx = await contract.setRiskyAddress(addr, true);
    await tx.wait();

    setMessage("✅ Address marked as risky!", 'success');
    clearInputs('riskyAddress');

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to mark risky: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('setRiskyBtn', false);
  }
};

document.getElementById("setTrustedBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    let addr = document.getElementById("trustedAddress").value.trim();
    if (!ethers.isAddress(addr)) return setMessage("❌ Invalid address format.", 'error');

    setButtonLoading('setTrustedBtn', true);
    setMessage("🔄 Adding trusted address...", 'info');

    const tx = await contract.setTrustedAddress(addr, true);
    await tx.wait();

    setMessage("✅ Trusted address added!", 'success');
    clearInputs('trustedAddress');

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to add trusted address: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('setTrustedBtn', false);
  }
};

document.getElementById("toggleSafeModeBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    setButtonLoading('toggleSafeModeBtn', true);
    setMessage("🔄 Toggling safe mode...", 'info');

    const tx = await contract.toggleSafeMode(true);
    await tx.wait();
    
    setMessage("✅ Safe mode toggled!", 'success');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to toggle safe mode: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('toggleSafeModeBtn', false);
  }
};


//------------------------------------------------------
// FREEZE CONTROLS
//------------------------------------------------------
document.getElementById("manualFreezeBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    setButtonLoading('manualFreezeBtn', true);
    setMessage("🔄 Activating manual freeze...", 'info');

    const tx = await contract.manualFreeze();
    await tx.wait();
    
    setMessage("❄️ Manual freeze activated!", 'success');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Manual freeze failed: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('manualFreezeBtn', false);
  }
};

document.getElementById("guardianFreezeBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    setButtonLoading('guardianFreezeBtn', true);
    setMessage("🔄 Activating guardian freeze...", 'info');

    const tx = await contract.guardianFreeze();
    await tx.wait();
    
    setMessage("🛡️ Guardian freeze activated!", 'success');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    setMessage("❌ Guardian freeze failed: " + (err.reason || err.message), 'error');
  } finally {
    setButtonLoading('guardianFreezeBtn', false);
  }
};

document.getElementById("unfreezeBtn").onclick = async () => {
  try {
    if (!contract) return setMessage("⚠️ Wallet not connected.", 'error');
    
    setButtonLoading('unfreezeBtn', true);
    setMessage("🔄 Attempting to unfreeze wallet...", 'info');

    const tx = await contract.unfreeze();
    await tx.wait();
    
    setMessage("🔓 Wallet unfrozen successfully!", 'success');

    setTimeout(() => document.getElementById("refreshStatusBtn").click(), 1000);

  } catch (err) {
    console.error(err);
    const errorMsg = err.reason || err.message;

    if (errorMsg.includes("timelock") || errorMsg.includes("time"))
      setMessage("⏱️ Timelock not over yet!", 'error');
    else
      setMessage("❌ Unfreeze failed: " + errorMsg, 'error');

  } finally {
    setButtonLoading('unfreezeBtn', false);
  }
};
