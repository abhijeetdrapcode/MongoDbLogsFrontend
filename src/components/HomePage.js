import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <div className="container rounded mt-5 bg-dark p-5">
      <div className="jumbotron text-white">
        <h1 className="display-4 ">HomePage</h1>
        <p className="lead">This is just for testing purpose</p>
        <p>
          You can't. Even for things that aren't a website, like an embedded
          device, somebody could always open up the hardware and inspect the
          firmware or, in an extreme case, de-cap the chips and examine them
          with an electron microscope. For websites, it's utterly trivial.
          Anything and everything your client can do, so can any other client.
          That's inherent in the decentralized nature of the Internet and also
          in the way web pages work. There are things you can do to limit abuse,
          like having your server make the request (rather than the user's
          browser) and limiting the rate at which it will do so on your users'
          behalves. Authentication might potentially let you limit requests per
          user and/or pass along the bill. Actually controlling the client used
          to talk to your server (or the third-party one) is impossible, though.
          At best, you can obfuscate your code and try to hide the access key,
          but in the end, you can't hide it perfectly.
        </p>
        <hr className="my-4" />
        <p>Click the button below to view the audit logs.</p>
        <Link to="/audit-log" className="btn btn-primary btn-lg">
          Open Audit Logs
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
