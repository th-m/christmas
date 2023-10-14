import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

function SignUpButton() {
  const clerk = useClerk();
  const location = useLocation();
  return (
    <button
      className="sign-up-btn"
      style={{ width: 200, height: 120, margin: "auto" }}
      onClick={() => clerk.openSignUp({ redirectUrl: `${location.pathname}` })}
    >
      Sign up
    </button>
  );
}

function SignInButton() {
  const clerk = useClerk();
  const location = useLocation();
  return (
    <button
      className="sign-in-btn"
      onClick={() => clerk.openSignIn({ redirectUrl: `${location.pathname}` })}
    >
      Sign in
    </button>
  );
}
function isInEmbeddedBrowser() {
  // Get the user agent string.
  const userAgent = navigator.userAgent;

  // Check if the user agent string contains any of the following strings, which are commonly used by embedded browsers:
  const embeddedBrowserStrings = [
    "UCBrowser",
    "WeChat",
    "QQBrowser",
    "SogouBrowser",
    "AlipayBrowser",
    "BaiduBrowser",
    "FBAN",
    "FBAV",

  ];

  // Return true if the user agent string contains any of the embedded browser strings.
  return embeddedBrowserStrings.some(string => userAgent.includes(string));
}
export const NavControls = () => {
  const user = useUser();
  // const history = useHistory();
  const [copied, setCopied] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleCopy = () => {
    setCopied(true)
    navigator.clipboard.writeText(window.location.href);
    
    setTimeout(() => {
        setCopied(false);
    }, 2000);
}
  if (isInEmbeddedBrowser()) {
    // The page is in an iframe.
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection:'column',
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>
          This site is being viewed in an embedded browser. 
        </p>
        <p>
          Click the button to copy the url, then open in a new browser.
        </p>

        <button
          className="sign-up-btn"
          style={{ width: 200, height: 120, margin: "auto" }}
          onClick={handleCopy}
        >
          {copied?"Copied ":window.location.href}
        </button>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        {/* <ul>
          <li> */}
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SignUpButton />
        </div>
        {/* </li>

          <li> */}
        {/* <SignInButton /> */}
        {/* </li> */}
        {/* </ul> */}
      </SignedOut>

      <SignedIn>
        <div className="amazon-banner" style={{padding:'1rem'}}>
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center', maxWidth:600, margin:'auto'}}>

            {/* <SignOutButton /> */}
            {String(user.user?.id) !== "" && (
              <>
                {location.pathname === "/create-game" ? (
                  <button
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    active games
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/create-game");
                    }}
                  >
                    organize games
                  </button>
                )}
              </>
            )}
          
            <span
            style={{font:'unset', fontWeight:'unset'}}
             >

              <UserButton afterSignOutUrl="/" />
            </span>
          </div>
        </div>
      </SignedIn>
    </>
  );
};
