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
    <div className="max-w-4xl mx-auto center p-5 my-7">
       <p className="my-7">3/3</p>
      <h1 className="text-xl font-bold">And how would you like to work?</h1>
      <p>Everybody works in different ways, so we have different ways of helping you win work. You can select multiple preferences now and can always change it later!</p>
      
      <div className="text-left my-5">
  <label className="flex items-start gap-2">
    <input type="checkbox" className="mt-1 accent-black" />
    <span className="font-medium">I'd like to find opportunities myself</span>
  </label>
  <p className="text-gray-600 text-sm mt-1">
    Clients post jobs on our Talent Marketplace. You can browse and bid on them, or get invited by a client.
  </p>

  <label className="flex items-start gap-2 mt-4">
    <input type="checkbox" className="mt-1 accent-black" />
    <span className="font-medium">I'd like to package up my work for clients to buy</span>
  </label>
  <p className="text-gray-600 text-sm mt-1">
    Define your service with prices and timelines. We'll list it in our Project Catalog for clients to buy right away.
  </p>

  <label className="flex items-start gap-2 mt-4">
    <input type="checkbox" className="mt-1 accent-black" />
    <span className="font-medium">I'm open to contract-to-hire opportunities</span>
  </label>
  <p className="text-gray-600 text-sm mt-1">
    Start with a contract, and later explore a full-time option with the client.
  </p>
</div>

<div className="flex justify-between mt-6">
  <button
    onClick={handleBack}
    className="px-5 py-2 text-lg border border-gray-400 rounded-lg hover:bg-gray-100 transition"
  >
    Back
  </button>
  <button
    onClick={handleNext}
    className="px-5 py-2 text-lg bg-black text-white rounded-lg hover:bg-gray-800 transition"
  >
    Next, create a profile
  </button>
</div>

    </div>
  );
};

export default Step6;