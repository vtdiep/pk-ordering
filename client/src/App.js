import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {

    // Check to see if this is a redirect back from Checkout

    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {

      setMessage("Order placed! You will receive an email confirmation.");

    }

    if (query.get("canceled")) {

      setMessage(

        "Order canceled -- continue to shop around and checkout when you're ready."

      );

    }

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="Stripe">
      message ? (

<Message message={message} />

) : (

<ProductDisplay />

);
      </div>
    </div>

  );
}

export default App;

const Message = ({ message }) => (

  <section>

    <p>{message}</p>

  </section>

);

const ProductDisplay = () => (

  <section>

    <div className="product">

      <img

        src="https://i.imgur.com/EHyR2nP.png"

        alt="The cover of Stubborn Attachments"

      />

      <div className="description">

        <h3>Stubborn Attachments</h3>

        <h5>$20.00</h5>

      </div>

    </div>

    <form action="http://localhost:3000/stripe/test/checkout" method="POST">

      <button type="submit">

  Test Checkout

      </button>

    </form>

  </section>

);
