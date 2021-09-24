import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import pklogo from './pokemainlogo-crop.png';
import './App.css';
import { Header } from './components/Header';
import { MenuContainer } from './components/MenuContainer';
import { ViewCheckoutButton } from './components/ViewCheckoutButton';
import { Nav } from './components/Nav';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout

    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
    }

    if (query.get('cancelled')) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready.",
      );
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <div id="hero_image_container">
        <picture>
          <img id="hero_image" src="pekoe_2000.jpg" alt="" />
        </picture>
      </div>

      <div className="store">
        <Nav />
        <MenuContainer />
      </div>

      <ViewCheckoutButton />

      <header className="App-header">
        <img src={pklogo} className="App-logo" alt="logo" />
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
        {message ? <Message message={message} /> : <ProductDisplay />}
      </div>
    </div>
  );
}

export default App;

interface MessageProps {
  message: string;
}

const Message = ({ message }: MessageProps) => (
  <section>
    <p>{message}</p>
  </section>
);

const ProductDisplay = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('og post blocked');
    let data = {
      email: 'be@be.com',
      name: 'Be Ra',
      pickup_time: '2021-12-20T08:35:17.786Z',
      amount_paid: 2.5,
      tax: 0,
      details: {
        items: [
          {
            id: 5,
            name: 'Pie',
            price: 2.5,
            quantity: 1,
            mods: [
              { id: 2, modifierItemIds: [19] },
              { id: 3, modifierItemIds: [21] },
            ],
          },
        ],
      },
    };
    const response = await fetch('http://localhost:3000/order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
    });
    const body = await response.json();
    console.log(`response is ${JSON.stringify(body)}`);

    // if(body.url){
    //   window.location.href = body.url
    // }
  };

  return (
    <section>
      <div className="product">
        <img
          src="http://placekitten.com/200/200"
          alt="The cover of Stubborn Attachments"
        />

        <div className="description">
          <h3>Stubborn Attachments</h3>

          <h5>$20.00</h5>
        </div>
      </div>

      <form
        action="http://localhost:3000/stripe/checkout"
        method="POST"
        onSubmit={handleSubmit}
      >
        <button type="submit">Checkout</button>
      </form>

      <form action="http://localhost:3000/stripe/test/checkout" method="POST">
        <button type="submit">Test Checkout</button>
      </form>
    </section>
  );
};
