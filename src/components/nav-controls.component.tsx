import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
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

export const NavControls = () => {
  const user = useUser();
  // const history = useHistory();
  const location = useLocation();
  const navigate = useNavigate();

  if (window?.top?.location !== window.location) {
    // The page is in an iframe.
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p>
        This site is being viewed in an embedded browser. Would you like to open
        it in your default browser?
      </p>
      <button
        className="sign-up-btn"
        style={{ width: 200, height: 120, margin: "auto" }}
        onClick={() => (window.location.href = window.location.href)}
      >
        Open App
      </button>
    </div>;
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
        <div className="amazon-banner">
          <div>
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
            <a
              href="https://www.amazon.com/?tag=thmcodes-20&linkCode=ez"
              target="_blank"
            >
              <button>Buy Stuff</button>
            </a>
            {/* <UserButton afterSignOutUrl="/" /> */}
          </div>
        </div>
      </SignedIn>
    </>
  );
};
