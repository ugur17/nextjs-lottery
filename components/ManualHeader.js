import { useEffect } from "react";
import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

    useEffect( () => {
        if(isWeb3Enabled) return;
        if(typeof window !== "undefined") {
            if(window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled] ) // This closed bracket means dependency array of useEffect hook
    // No dependency array: run anytime something re-render (Be careful with this bcs then you can end up with circular rendering)
    // Blank dependency array: Run only once on load
    // Dependencies in there: Run anytime something changed in the dependency array


    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if(account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
            }
        })
    }, [])

    return(
        <div>
            {
            account 
            ? (<div> Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)} </div>) 
            : (<button 
                onClick={async () => {
                    await enableWeb3()
                    if(typeof window !== 'undefined') {
                        window.localStorage.setItem("connected", "injected");
                    }
                    }
                }
                disabled = {isWeb3EnableLoading} 
            >
                Connect 
            </button>)
            }
        </div>
    )
}