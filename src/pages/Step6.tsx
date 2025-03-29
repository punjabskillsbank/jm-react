import { useNavigate } from "react-router-dom";

const Step6 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/signup/step7");
  };

  const handleBack = () => {
    navigate("/signup/step5");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center", padding: "20px" }}>
      <h2>3/3</h2>
      <h1>And how would you like to work?</h1>
      <p>Everybody works in different ways, so we have different ways of helping you win work. You can select multiple preferences now and can always change it later!</p>
      
      <div style={{ textAlign: "left", margin: "20px 0" }}>
        <label>
          <input type="checkbox" /> I'd like to find opportunities myself
        </label>
        <p>Clients post jobs on our Talent Marketplace. You can browse and bid on them, or get invited by a client.</p>
      
        <label>
          <input type="checkbox" /> I'd like to package up my work for clients to buy
        </label>
        <p>Define your service with prices and timelines. We'll list it in our Project Catalog for clients to buy right away.</p>
      
        <label>
          <input type="checkbox" /> I'm open to contract-to-hire opportunities
        </label>
        <p>Start with a contract, and later explore a full-time option with the client.</p>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button onClick={handleBack} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Back
        </button>
        <button onClick={handleNext} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          Next, create a profile
        </button>
      </div>
    </div>
  );
};

export default Step6;